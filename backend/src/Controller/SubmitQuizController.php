<?php

namespace App\Controller;

use App\Entity\AttemptAnswer;
use App\Entity\QcmAttempt;
use App\Repository\ChoiceRepository;
use App\Repository\QcmInvitationRepository;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class SubmitQuizController
{
    public function __construct(
        private QcmInvitationRepository $invitationRepo,
        private ChoiceRepository        $choiceRepo,
        private QuestionRepository      $questionRepo,
        private EntityManagerInterface  $em,
    ) {}

    public function __invoke(string $token, Request $request): JsonResponse
    {
        $invitation = $this->invitationRepo->findOneBy(['token' => $token]);

        if (!$invitation) {
            return new JsonResponse(['message' => 'Invitation introuvable'], 404);
        }

        $data    = json_decode($request->getContent(), true);
        // answers = { "questionId": choiceId, ... }
        $answers = $data['answers'] ?? [];

        $version   = $invitation->getVersion();
        $questions = $version->getQuestions();
        $total     = count($questions);

        // ── Créer l'attempt ──────────────────────────────────────────────────
        $attempt = new QcmAttempt();
        $attempt->setQcm($invitation->getQcm());
        $attempt->setVersion($version);
        $attempt->setInvitation($invitation);
        $attempt->setCandidateEmail($invitation->getCandidateEmail());
        $attempt->setCandidateName($invitation->getCandidateName());
        $attempt->setSubmittedAt(new \DateTimeImmutable());
        $this->em->persist($attempt);

        // ── Calculer le score ────────────────────────────────────────────────
        $score   = 0;
        $details = [];

        foreach ($questions as $question) {
            $chosenId = $answers[(string) $question->getId()] ?? ($answers[$question->getId()] ?? null);
            $correct  = false;

            if ($chosenId) {
                $choice = $this->choiceRepo->find((int) $chosenId);

                if ($choice && $choice->getQuestion()->getId() === $question->getId()) {
                    $correct = $choice->isCorrect();
                    if ($correct) $score++;

                    // ── Sauvegarder la réponse ───────────────────────────────
                    $answer = new AttemptAnswer();
                    $answer->setAttempt($attempt);
                    $answer->setQuestion($question);
                    $answer->setChoice($choice);
                    $answer->setIsCorrect($correct);
                    $this->em->persist($answer);
                }
            }

            $details[] = [
                'questionId' => $question->getId(),
                'chosenId'   => $chosenId,
                'correct'    => $correct,
            ];
        }

        // ── Finaliser l'attempt ──────────────────────────────────────────────
        $percent = $total > 0 ? round(($score / $total) * 100) : 0;
        $passed  = $total > 0 && ($score / $total) >= 0.5;

        $attempt->setScore($score);
        $attempt->setPassed($passed);

        $this->em->flush();

        return new JsonResponse([
            'score'   => $score,
            'total'   => $total,
            'percent' => $percent,
            'passed'  => $passed,
            'details' => $details,
        ]);
    }
}