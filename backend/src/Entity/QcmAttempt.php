<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

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

    public function __construct()
    {
        $this->startedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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
}