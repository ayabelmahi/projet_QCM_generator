<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class QcmInvitation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 64)]
    private string $token;

    #[ORM\ManyToOne(targetEntity: Qcm::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $qcm = null;

    #[ORM\ManyToOne(targetEntity: QcmVersion::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?QcmVersion $version = null;

    #[ORM\Column(nullable: true)]
    private ?string $candidateEmail = null;

    #[ORM\Column(nullable: true)]
    private ?string $candidateName = null;

    #[ORM\Column]
    private string $status = 'pending';

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $expiresAt = null;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->token = bin2hex(random_bytes(32));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function getQcm(): ?Qcm
    {
        return $this->qcm;
    }

    public function setQcm(Qcm $qcm): self
    {
        $this->qcm = $qcm;
        return $this;
    }

    public function getVersion(): ?QcmVersion
    {
        return $this->version;
    }

    public function setVersion(QcmVersion $version): self
    {
        $this->version = $version;
        return $this;
    }

    public function setCandidateEmail(?string $email): self
    {
        $this->candidateEmail = $email;
        return $this;
    }

    public function setCandidateName(?string $name): self
    {
        $this->candidateName = $name;
        return $this;
    }
}