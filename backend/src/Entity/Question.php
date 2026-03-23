<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\QuestionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\QcmVersion;

#[ORM\Entity(repositoryClass: QuestionRepository::class)]
#[ApiResource]
class Question
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['qcm:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'questions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $qcm = null;

    #[ORM\ManyToOne(targetEntity: QcmVersion::class, inversedBy: 'questions')]
    #[ORM\JoinColumn(nullable: true)]
    private ?QcmVersion $version = null;

    #[ORM\Column(length: 50)]
    #[Groups(['qcm:read'])]
    private ?string $type = 'text'; // text, image, video, audio

    #[ORM\Column(type: 'text')]
    #[Groups(['qcm:read'])]
    private ?string $content = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $mediaUrl = null;

    #[ORM\OneToMany(mappedBy: 'question', targetEntity: Choice::class, orphanRemoval: true)]
    #[Groups(['qcm:read'])]
    private Collection $choices;

    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQcm(): ?Qcm
    {
        return $this->qcm;
    }

    public function setQcm(?Qcm $qcm): self
    {
        $this->qcm = $qcm;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getMediaUrl(): ?string
    {
        return $this->mediaUrl;
    }

    public function setMediaUrl(?string $mediaUrl): self
    {
        $this->mediaUrl = $mediaUrl;
        return $this;
    }

    /** @return Collection<int, Choice> */
    public function getChoices(): Collection
    {
        return $this->choices;
    }

    public function addChoice(Choice $choice): self
    {
        if (!$this->choices->contains($choice)) {
            $this->choices->add($choice);
            $choice->setQuestion($this);
        }
        return $this;
    }

    public function removeChoice(Choice $choice): self
    {
        if ($this->choices->removeElement($choice)) {
            if ($choice->getQuestion() === $this) {
                $choice->setQuestion(null);
            }
        }
        return $this;
    }
    public function getVersion(): ?QcmVersion
    {
        return $this->version;
    }

    public function setVersion(?QcmVersion $version): self
    {
        $this->version = $version;
        return $this;
    }
}
