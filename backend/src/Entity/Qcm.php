<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\QcmRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QcmRepository::class)]
#[ApiResource]
class Qcm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'qcms')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null; // Un QCM appartient à 1 user

    #[ORM\Column(length: 255)]
    private ?string $title = null; // Titre du QCM

    #[ORM\Column(length: 255)]
    private ?string $subject = null; // Sujet (thématique)

    #[ORM\Column]
    private ?int $successRate = 80; // Seuil de réussite

    #[ORM\Column(nullable: true)]
    private ?int $timerSeconds = null; // Durée optionnelle

    #[ORM\Column(length: 50)]
    private ?string $status = 'draft'; // Statut initial

    #[ORM\Column]
    private ?bool $isPdfAllowed = true; // Autorisation PDF

    #[ORM\OneToMany(mappedBy: 'qcm', targetEntity: Question::class, orphanRemoval: true)]
    private Collection $questions; // Liste des questions rattachées
    #[ORM\Column]
    private int $versionsCount = 1;
    public function getVersionsCount(): int
    {
        return $this->versionsCount;
    }

    public function setVersionsCount(int $versionsCount): self
    {
        $this->versionsCount = $versionsCount;
        return $this;
    }

    public function __construct()
    {
        $this->questions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(string $subject): self
    {
        $this->subject = $subject;
        return $this;
    }

    public function getSuccessRate(): ?int
    {
        return $this->successRate;
    }

    public function setSuccessRate(int $successRate): self
    {
        $this->successRate = $successRate;
        return $this;
    }

    public function getTimerSeconds(): ?int
    {
        return $this->timerSeconds;
    }

    public function setTimerSeconds(?int $timerSeconds): self
    {
        $this->timerSeconds = $timerSeconds;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function isIsPdfAllowed(): ?bool
    {
        return $this->isPdfAllowed;
    }

    public function setIsPdfAllowed(bool $isPdfAllowed): self
    {
        $this->isPdfAllowed = $isPdfAllowed;
        return $this;
    }

    /**
     * @return Collection<int, Question>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setQcm($this);
        }
        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getQcm() === $this) {
                $question->setQcm(null);
            }
        }
        return $this;
    }

    public function isPdfAllowed(): ?bool
    {
        return $this->isPdfAllowed;
    }
}
