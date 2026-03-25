<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
    ],
    normalizationContext: ['groups' => ['attempt:read']],
    paginationEnabled: false,
)]
#[ORM\Entity]
class QcmAttempt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Qcm::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $qcm = null;

    #[ORM\ManyToOne(targetEntity: QcmVersion::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?QcmVersion $version = null;

    #[ORM\ManyToOne(targetEntity: QcmInvitation::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?QcmInvitation $invitation = null;

    #[ORM\Column(nullable: true)]
    private ?string $candidateEmail = null;

    #[ORM\Column(nullable: true)]
    private ?string $candidateName = null;

    #[ORM\Column]
    private \DateTimeImmutable $startedAt;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $submittedAt = null;

    #[ORM\Column(nullable: true)]
    private ?int $durationSeconds = null;

    #[ORM\Column(nullable: true)]
    private ?int $score = null;

    #[ORM\Column(nullable: true)]
    private ?bool $passed = null;

    #[ORM\Column]
    private string $status = 'in_progress';

    #[ORM\OneToMany(mappedBy: 'attempt', targetEntity: AttemptAnswer::class)]
    private Collection $answers;

    public function __construct()
    {
        $this->startedAt = new \DateTimeImmutable();
        $this->answers = new ArrayCollection();
    }

    #[Groups(['attempt:read'])]
    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['attempt:read'])]
    public function getCandidateEmail(): ?string
    {
        return $this->candidateEmail;
    }

    #[Groups(['attempt:read'])]
    public function getCandidateName(): ?string
    {
        return $this->candidateName;
    }

    #[Groups(['attempt:read'])]
    public function getScore(): ?int
    {
        return $this->score;
    }

    #[Groups(['attempt:read'])]
    public function getPassed(): ?bool
    {
        return $this->passed;
    }

    #[Groups(['attempt:read'])]
    public function getStatus(): string
    {
        return $this->status;
    }

    #[Groups(['attempt:read'])]
    public function getSubmittedAt(): ?\DateTimeImmutable
    {
        return $this->submittedAt;
    }

    #[Groups(['attempt:read'])]
    public function getQcm(): ?Qcm
    {
        return $this->qcm;
    }

    #[Groups(['attempt:read'])]
    public function getAnswers(): Collection
    {
        return $this->answers;
    }

    public function getVersion(): ?QcmVersion
    {
        return $this->version;
    }

    public function getInvitation(): ?QcmInvitation
    {
        return $this->invitation;
    }

    public function getStartedAt(): \DateTimeImmutable
    {
        return $this->startedAt;
    }

    public function getDurationSeconds(): ?int
    {
        return $this->durationSeconds;
    }

    public function setQcm(Qcm $qcm): self
    {
        $this->qcm = $qcm;
        return $this;
    }

    public function setVersion(QcmVersion $version): self
    {
        $this->version = $version;
        return $this;
    }

    public function setInvitation(QcmInvitation $invitation): self
    {
        $this->invitation = $invitation;
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

    public function setScore(int $score): self
    {
        $this->score = $score;
        return $this;
    }

    public function setPassed(bool $passed): self
    {
        $this->passed = $passed;
        return $this;
    }

    public function setSubmittedAt(\DateTimeImmutable $date): self
    {
        $this->submittedAt = $date;
        return $this;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function setDurationSeconds(?int $seconds): self
    {
        $this->durationSeconds = $seconds;
        return $this;
    }
}