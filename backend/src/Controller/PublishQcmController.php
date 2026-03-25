<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Entity\QcmInvitation;
use App\Service\VersionGenerator;
use App\Service\PdfGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class PublishQcmController
{
    public function __construct(
        private VersionGenerator $versionGenerator,
        private EntityManagerInterface $em,
        private MailerInterface $mailer,
        private PdfGenerator $pdfGenerator,
    ) {}

    public function __invoke(Qcm $qcm, Request $request): Response
    {
        $data   = json_decode($request->getContent(), true);
        $mode   = $data['mode'] ?? null;
        $emails = $data['emails'] ?? [];

        if (!in_array($mode, ['web', 'pdf'], true)) {
            return new JsonResponse(['message' => 'Mode invalide.'], 400);
        }

        if ($mode === 'web') {
            if (empty($emails)) {
                return new JsonResponse(['message' => 'Aucun email fourni'], 400);
            }

            $result   = $this->versionGenerator->generate($qcm, count($emails));
            $versions = $result['versions'];
            $qcm      = $result['qcm'];

            $invitations = [];

            foreach ($emails as $index => $candidat) {
                $email = is_array($candidat) ? $candidat['email'] : $candidat;
                $name  = is_array($candidat) ? ($candidat['name'] ?? null) : null;

                $invitation = new QcmInvitation();
                $invitation->setQcm($qcm);
                $invitation->setVersion($versions[$index]);
                $invitation->setCandidateEmail($email);
                $invitation->setCandidateName($name);
                $invitation->setStatus('sent');
                $this->em->persist($invitation);

                $link = 'http://localhost:5173/quiz/' . $invitation->getToken();

                // Générer le QR code
                // Générer le QR code
                $qrCode   = new QrCode($link);
                $writer   = new PngWriter();
                $result2  = $writer->write($qrCode);
                $qrBase64 = base64_encode($result2->getString());

                $this->sendInvitationEmail($email, $name, $qcm, $link, $qrBase64);

                $invitations[] = [
                    'email' => $email,
                    'name'  => $name,
                    'token' => $invitation->getToken(),
                    'link'  => $link,
                ];
            }

            $qcm->setStatus('published');
            $this->em->flush();

            return new JsonResponse([
                'message'     => 'Invitations créées et envoyées avec succès',
                'mode'        => 'web',
                'invitations' => $invitations,
            ]);
        }

        // MODE PDF
        $copies = max(1, (int) ($data['copies'] ?? 1));

        $result   = $this->versionGenerator->generate($qcm, $copies);
        $versions = $result['versions'];
        $qcm      = $result['qcm'];

        $qcm->setStatus('published');
        $this->em->flush();

        $versionIds = array_map(fn($v) => $v->getId(), $versions);
        $this->em->clear();
        $versions = $this->em->getRepository(\App\Entity\QcmVersion::class)->findBy(['id' => $versionIds]);

        $zipPath = sys_get_temp_dir() . '/qcm_' . time() . '.zip';
        $zip = new \ZipArchive();

        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return new JsonResponse(['message' => 'Erreur lors de la création du ZIP'], 500);
        }

        foreach ($versions as $version) {
            $pdfContent = $this->pdfGenerator->generateForVersion($version);
            $filename   = sprintf(
                '%s_v%d.pdf',
                preg_replace('/[^a-z0-9]/i', '_', $qcm->getTitle()),
                $version->getVersionNumber()
            );
            $zip->addFromString($filename, $pdfContent);
        }

        $zip->close();

        $zipContent = file_get_contents($zipPath);
        unlink($zipPath);

        $zipName = preg_replace('/[^a-z0-9]/i', '_', $qcm->getTitle()) . '_PDFs.zip';

        return new Response($zipContent, 200, [
            'Content-Type'        => 'application/zip',
            'Content-Disposition' => 'attachment; filename="' . $zipName . '"',
            'Content-Length'      => strlen($zipContent),
        ]);
    }

    private function sendInvitationEmail(
        string $to,
        ?string $name,
        Qcm $qcm,
        string $link,
        string $qrBase64
    ): void {
        $displayName = $name ?? 'Candidat';

        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 6px rgba(0,0,0,0.05);">

                            <!-- HEADER -->
                            <tr>
                                <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:40px;text-align:center;">
                                    <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:16px;">
                                        <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
                                            🎓
                                        </div>
                                        <span style="color:#ffffff;font-size:18px;font-weight:700;">QSM Generator</span>
                                    </div>
                                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">
                                        Vous êtes invité(e) !
                                    </h1>
                                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
                                        Un quiz vous attend
                                    </p>
                                </td>
                            </tr>

                            <!-- BODY -->
                            <tr>
                                <td style="padding:40px;">
                                    <p style="color:#64748b;font-size:14px;margin:0 0 6px;">Bonjour,</p>
                                    <h2 style="color:#1e293b;font-size:22px;margin:0 0 20px;font-weight:700;">
                                        {$displayName} 👋
                                    </h2>
                                    <p style="color:#64748b;font-size:14px;line-height:1.7;margin:0 0 28px;">
                                        Vous avez été invité(e) à passer le quiz suivant. Cliquez sur le bouton ci-dessous ou scannez le QR code pour commencer.
                                    </p>

                                    <!-- QUIZ INFO -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:28px;">
                                        <tr>
                                            <td style="padding:20px 24px;">
                                                <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Quiz</p>
                                                <p style="margin:0 0 16px;color:#1e293b;font-size:20px;font-weight:700;">{$qcm->getTitle()}</p>
                                                <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Matière</p>
                                                <p style="margin:0;color:#475569;font-size:14px;">{$qcm->getSubject()}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- CTA BUTTON -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                        <tr>
                                            <td align="center">
                                                <a href="{$link}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.02em;">
                                                    Accéder à mon quiz →
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- QR CODE -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
                                        <tr>
                                            <td style="padding:24px;" align="center">
                                                <p style="margin:0 0 16px;color:#475569;font-size:13px;font-weight:500;">
                                                    📱 Ou scannez ce QR code avec votre téléphone
                                                </p>
                                                <div style="background:#ffffff;padding:12px;border-radius:12px;display:inline-block;border:1px solid #e2e8f0;">
                                                    <img src="data:image/png;base64,{$qrBase64}" width="150" height="150" alt="QR Code" style="display:block;" />
                                                </div>
                                                <p style="margin:12px 0 0;color:#94a3b8;font-size:11px;">
                                                    Lien personnel et sécurisé
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- LINK -->
                                    <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                                        <a href="{$link}" style="color:#6366f1;word-break:break-all;">{$link}</a>
                                    </p>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                                    <p style="margin:0;color:#94a3b8;font-size:12px;">
                                        Ce lien est personnel et uniquement destiné à <strong style="color:#64748b;">{$to}</strong>
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        HTML;

        $email = (new Email())
            ->from('noreply@qsm-generator.app')
            ->to($to)
            ->subject("Invitation au quiz : {$qcm->getTitle()}")
            ->html($html);

        $this->mailer->send($email);
    }
}
