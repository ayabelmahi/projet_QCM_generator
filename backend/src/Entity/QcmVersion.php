<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class QcmVersion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Qcm::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $qcm = null;

    #[ORM\Column]
    private int $versionNumber;

    #[ORM\Column(length: 36)]
    private string $publicId;

    #[ORM\Column]
    private int $shuffleSeed;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->publicId = bin2hex(random_bytes(16));
        $this->shuffleSeed = random_int(1, 999999);
    }

    public function getId(): ?int { return $this->id; }

    public function getQcm(): ?Qcm { return $this->qcm; }

    public function setQcm(Qcm $qcm): self { $this->qcm = $qcm; return $this; }

    public function getVersionNumber(): int { return $this->versionNumber; }

    public function setVersionNumber(int $versionNumber): self { $this->versionNumber = $versionNumber; return $this; }

    public function getPublicId(): string { return $this->publicId; }

    public function getShuffleSeed(): int { return $this->shuffleSeed; }
}