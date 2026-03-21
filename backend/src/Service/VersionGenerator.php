<?php

namespace App\Service;

use App\Entity\Qcm;
use App\Entity\QcmVersion;
use Doctrine\ORM\EntityManagerInterface;

class VersionGenerator
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function generate(Qcm $qcm, int $count): array
    {
        $versions = [];

        // 🔥 supprimer anciennes versions
        $existing = $this->em
            ->getRepository(QcmVersion::class)
            ->findBy(['qcm' => $qcm]);

        foreach ($existing as $v) {
            $this->em->remove($v);
        }

        $this->em->flush();

        for ($i = 1; $i <= $count; $i++) {

            $seed = hash('sha256', $qcm->getId() . '-' . $i . '-qcm');
            $version = new QcmVersion();
            $version->setQcm($qcm);
            $version->setVersionNumber($i);
            $version->setShuffleSeed($seed);
            $version->setPublicId(bin2hex(random_bytes(16)));
            $version->setCreatedAt(new \DateTimeImmutable());

            $this->em->persist($version);
            $versions[] = $version;
        }

        $this->em->flush();

        return $versions;
    }
}
