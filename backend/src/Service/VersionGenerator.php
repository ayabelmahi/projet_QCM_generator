<?php
namespace App\Service;

use App\Entity\Choice;
use App\Entity\Qcm;
use App\Entity\Question;
use App\Entity\QcmVersion;
use Doctrine\ORM\EntityManagerInterface;

class VersionGenerator
{
    public function __construct(private EntityManagerInterface $em) {}

    public function generate(Qcm $qcm, int $count): array
    {
        $qcmId = $qcm->getId();
        $versions = [];

        // Supprimer anciennes versions
        $existing = $this->em
            ->getRepository(QcmVersion::class)
            ->findBy(['qcm' => $qcm]);

        foreach ($existing as $v) {
            $this->em->remove($v);
        }
        $this->em->flush();

        // ✅ Vider complètement le cache Doctrine
        $this->em->clear();

        // ✅ Recharger $qcm proprement depuis la DB
        $qcm = $this->em->getRepository(Qcm::class)->find($qcmId);

        // ✅ Requête DQL directe — charge tout proprement
        $originalQuestions = $this->em->createQuery(
            'SELECT q, c FROM App\Entity\Question q
             LEFT JOIN q.choices c
             WHERE q.qcm = :qcm AND q.version IS NULL'
        )->setParameter('qcm', $qcm)->getResult();

        $questionsWithChoices = [];
        foreach ($originalQuestions as $q) {
            $questionsWithChoices[] = [
                'question' => $q,
                'choices'  => $q->getChoices()->toArray(),
            ];
        }

        for ($i = 1; $i <= $count; $i++) {
            $version = new QcmVersion();
            $version->setQcm($qcm);
            $version->setVersionNumber($i);
            $version->setShuffleSeed((string) random_int(1, 999999));
            $version->setPublicId(bin2hex(random_bytes(16)));
            $version->setCreatedAt(new \DateTimeImmutable());
            $this->em->persist($version);

            $shuffled = $questionsWithChoices;
            shuffle($shuffled);

            foreach ($shuffled as $item) {
                $originalQuestion = $item['question'];
                $originalChoices  = $item['choices'];

                $newQuestion = new Question();
                $newQuestion->setQcm($qcm);
                $newQuestion->setVersion($version);
                $newQuestion->setType($originalQuestion->getType());
                $newQuestion->setContent($originalQuestion->getContent());
                $newQuestion->setMediaUrl($originalQuestion->getMediaUrl());
                $this->em->persist($newQuestion);

                shuffle($originalChoices);

                foreach ($originalChoices as $originalChoice) {
                    $newChoice = new Choice();
                    $newChoice->setQuestion($newQuestion);
                    $newChoice->setLabel($originalChoice->getLabel());
                    $newChoice->setIsCorrect($originalChoice->isCorrect());
                    $this->em->persist($newChoice);
                }
            }

            $versions[] = $version;
        }

        $this->em->flush();
      return ['versions' => $versions, 'qcm' => $qcm];
    }
}