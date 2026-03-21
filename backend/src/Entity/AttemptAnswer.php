<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class AttemptAnswer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: QcmAttempt::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?QcmAttempt $attempt = null;

    #[ORM\ManyToOne(targetEntity: Question::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Question $question = null;

    #[ORM\ManyToOne(targetEntity: Choice::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Choice $choice = null;

    #[ORM\Column]
    private bool $isCorrect;

    #[ORM\Column]
    private \DateTimeImmutable $answeredAt;

    public function __construct()
    {
        $this->answeredAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setAttempt(QcmAttempt $attempt): self
    {
        $this->attempt = $attempt;
        return $this;
    }

    public function setQuestion(Question $question): self
    {
        $this->question = $question;
        return $this;
    }

    public function setChoice(Choice $choice): self
    {
        $this->choice = $choice;
        return $this;
    }

    public function setIsCorrect(bool $isCorrect): self
    {
        $this->isCorrect = $isCorrect;
        return $this;
    }
}