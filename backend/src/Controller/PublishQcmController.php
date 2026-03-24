<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Entity\QcmInvitation;
use App\Service\VersionGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class PublishQcmController
{
    public function __construct(
        private VersionGenerator $versionGenerator,
        private EntityManagerInterface $em,
        private MailerInterface $mailer
    ) {}

    public function __invoke(Qcm $qcm, Request $request): JsonResponse
    {
        $data   = json_decode($request->getContent(), true);
        $mode   = $data['mode'] ?? null;
        $emails = $data['emails'] ?? [];

        if (!in_array($mode, ['web', 'pdf'], true)) {
            return new JsonResponse(['message' => 'Mode invalide.'], 400);
        }

        // ── MODE WEB ──────────────────────────────────────────────────────────
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

                // ✅ Envoi de l'email
                $this->sendInvitationEmail($email, $name, $qcm, $link);

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

        // ── MODE PDF ──────────────────────────────────────────────────────────
        if ($mode === 'pdf' && !$qcm->isPdfAllowed()) {
            return new JsonResponse(['message' => 'Ce QCM ne peut pas être publié en PDF.'], 400);
        }

        $copies = $qcm->getVersionsCount();
        $result = $this->versionGenerator->generate($qcm, $copies);
        $qcm    = $result['qcm'];

        $qcm->setStatus('published');
        $this->em->flush();

        return new JsonResponse([
            'message'          => 'Publication réussie',
            'mode'             => $mode,
            'versions_created' => count($result['versions']),
        ]);
    }

    // ── Email HTML ─────────────────────────────────────────────────────────────
    private function sendInvitationEmail(
        string $to,
        ?string $name,
        Qcm $qcm,
        string $link
    ): void {
        $displayName = $name ?? 'Candidat';

        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation au quiz</title>
        </head>
        <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">

                            <!-- HEADER -->
                            <tr>
                                <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:40px;text-align:center;">
                                    <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                                        <span style="font-size:28px;">📝</span>
                                    </div>
                                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                                        Vous avez été invité(e)
                                    </h1>
                                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
                                        à passer un quiz en ligne
                                    </p>
                                </td>
                            </tr>

                            <!-- BODY -->
                            <tr>
                                <td style="padding:40px;">
                                    <p style="color:#94a3b8;font-size:14px;margin:0 0 8px;">Bonjour,</p>
                                    <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 24px;font-weight:600;">
                                        {$displayName}
                                    </h2>

                                    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 24px;">
                                        Vous avez été invité(e) à passer le quiz suivant. Cliquez sur le bouton ci-dessous pour accéder à votre version personnalisée.
                                    </p>

                                    <!-- QUIZ INFO -->
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:12px;border:1px solid #334155;margin-bottom:32px;">
                                        <tr>
                                            <td style="padding:20px 24px;">
                                                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Quiz</p>
                                                <p style="margin:0 0 16px;color:#f1f5f9;font-size:18px;font-weight:700;">{$qcm->getTitle()}</p>
                                                <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Matière</p>
                                                <p style="margin:0;color:#cbd5e1;font-size:13px;">{$qcm->getSubject()}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- CTA BUTTON -->
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center">
                                                <a href="{$link}"
                                                   style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:12px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                                                    Accéder à mon quiz →
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="color:#475569;font-size:12px;text-align:center;margin:24px 0 0;line-height:1.6;">
                                        Ou copiez ce lien dans votre navigateur :<br>
                                        <a href="{$link}" style="color:#6366f1;word-break:break-all;">{$link}</a>
                                    </p>
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="background-color:#0f172a;padding:20px 40px;text-align:center;border-top:1px solid #1e293b;">
                                    <p style="margin:0;color:#475569;font-size:12px;">
                                        Ce lien est personnel et uniquement destiné à <strong style="color:#64748b;">{$to}</strong>
                                    </p>
                                    <p style="margin:8px 0 0;color:#334155;font-size:11px;">
                                        QSM Generator · Plateforme de quiz en ligne
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