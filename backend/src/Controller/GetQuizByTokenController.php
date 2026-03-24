<?php

namespace App\Controller;

use App\Repository\QcmInvitationRepository;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetQuizByTokenController
{
    public function __construct(
        private QcmInvitationRepository $repo
    ) {}

    public function __invoke(string $token): JsonResponse
    {
        $invitation = $this->repo->findOneBy(['token' => $token]);

        if (!$invitation) {
            return new JsonResponse(['message' => 'Invitation introuvable'], 404);
        }

        $version = $invitation->getVersion();

        if (!$version) {
            return new JsonResponse(['message' => 'Version introuvable'], 404);
        }

        $qcm = $invitation->getQcm();

        $questions = [];

        foreach ($version->getQuestions() as $q) {
            $choices = [];

            foreach ($q->getChoices() as $c) {
                $choices[] = [
                    'id'    => $c->getId(),
                    'label' => $c->getLabel(),
                ];
            }

            $questions[] = [
                'id'      => $q->getId(),
                'content' => $q->getContent(),
                'type'    => $q->getType(),
                'choices' => $choices,
            ];
        }

        return new JsonResponse([
            'title'         => $qcm->getTitle(),
            'subject'       => $qcm->getSubject(),
            'timerSeconds'  => $qcm->getTimerSeconds(),
            'candidateName' => $invitation->getCandidateName(),
            'token'         => $token,
            'questions'     => $questions,
        ]);
    }
}