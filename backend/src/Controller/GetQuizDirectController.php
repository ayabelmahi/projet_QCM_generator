<?php

namespace App\Controller;

use App\Repository\QcmRepository;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetQuizDirectController
{
    public function __construct(
        private QcmRepository $qcmRepo
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $qcm = $this->qcmRepo->find($id);

        if (!$qcm) {
            return new JsonResponse(['message' => 'Quiz introuvable'], 404);
        }

        $questions = [];
        foreach ($qcm->getQuestions() as $q) {
            if ($q->getVersionId() !== null) continue;
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
            'title'        => $qcm->getTitle(),
            'subject'      => $qcm->getSubject(),
            'timerSeconds' => $qcm->getTimerSeconds(),
            'questions'    => $questions,
        ]);
    }
}
