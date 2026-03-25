<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class AttemptAnswer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: QcmAttempt::class, inversedBy: 'answers')]
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

    #[Groups(['attempt:read'])]
    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['attempt:read'])]
    public function getIsCorrect(): bool
    {
        return $this->isCorrect;
    }

    #[Groups(['attempt:read'])]
    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    #[Groups(['attempt:read'])]
    public function getChoice(): ?Choice
    {
        return $this->choice;
    }

    #[Groups(['attempt:read'])]
    public function getAnsweredAt(): \DateTimeImmutable
    {
        return $this->answeredAt;
    }

    public function getAttempt(): ?QcmAttempt
    {
        return $this->attempt;
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