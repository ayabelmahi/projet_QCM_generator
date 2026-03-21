<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Service\VersionGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PublishQcmController
{
    public function __construct(
        private VersionGenerator $versionGenerator,
        private EntityManagerInterface $em
    ) {
    }

    public function __invoke(Qcm $qcm, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $mode = $data['mode'] ?? null;

        if (!in_array($mode, ['web', 'pdf'], true)) {
            return new JsonResponse([
                'message' => 'Mode invalide. Utilise web ou pdf.'
            ], 400);
        }

        if ($mode === 'pdf' && !$qcm->isPdfAllowed()) {
            return new JsonResponse([
                'message' => 'Ce QCM ne peut pas être publié en PDF.'
            ], 400);
        }

        $copies = $qcm->getVersionsCount();

        $versions = $this->versionGenerator->generate($qcm, $copies);

        $qcm->setStatus('published');
        $this->em->flush();

        return new JsonResponse([
            'message' => 'Publication réussie',
            'mode' => $mode,
            'versions_created' => count($versions)
        ]);
    }
}