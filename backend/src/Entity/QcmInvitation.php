<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Controller\GetQuizByTokenController;
use App\Repository\QcmInvitationRepository;
use App\Entity\QcmVersion;
use App\Entity\Qcm;

#[ORM\Entity(repositoryClass: QcmInvitationRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/quiz/{token}',
            controller: GetQuizByTokenController::class,
            read: false
        )
    ]
)]
class QcmInvitation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(unique: true)]
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
    public function getCandidateEmail(): ?string
    {
        return $this->candidateEmail;
    }

    public function getCandidateName(): ?string
    {
        return $this->candidateName;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    
    
}
