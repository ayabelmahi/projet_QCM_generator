<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ChoiceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChoiceRepository::class)]
#[ApiResource]
class Choice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['qcm:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'choices')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Question $question = null; // Un choix appartient à une question

    #[ORM\Column(type: 'text')]
    #[Groups(['qcm:read'])]
    private ?string $label = null; // Le texte de la réponse

    #[ORM\Column]
    #[Groups(['qcm:read'])]
    private ?bool $isCorrect = false; // Définit si c'est la bonne réponse

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(?Question $question): self
    {
        $this->question = $question;
        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;
        return $this;
    }

    // public function isIsCorrect(): ?bool
    // {
    //     return $this->isCorrect;
    // }

    public function setIsCorrect(bool $isCorrect): self
    {
        $this->isCorrect = $isCorrect;
        return $this;
    }

    public function isCorrect(): ?bool
    {
        return $this->isCorrect;
    }
}
