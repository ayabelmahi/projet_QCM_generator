"use client"

import React, { useState, useEffect } from "react"
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from "../ui_dashboard/dialog"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"
import { Label } from "../ui_dashboard/label"
import { Checkbox } from "../ui_dashboard/checkbox"
import { Switch } from "../ui_dashboard/switch"
import { Separator } from "../ui_dashboard/separator"
import { ScrollArea } from "../ui_dashboard/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui_dashboard/select"
import { Plus, Trash2, GripVertical, Image, Video, Music, Type } from "lucide-react"

// Données de secours si l'import mock-data échoue
const SUBJECTS_LIST = ["Informatique", "Mathématiques", "Français", "Histoire", "Sciences", "Anglais"]

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`
const createDefaultQuestion = () => ({
  id: generateId('q'),
  type: "text",
  content: "",
  choices: [
    { id: generateId('c'), text: "", isCorrect: false },
    { id: generateId('c'), text: "", isCorrect: false },
  ],
})

const typeOptions = [
  { value: "text", label: "Texte", icon: Type },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Vidéo", icon: Video },
  { value: "audio", label: "Audio", icon: Music },
]

export function QCMFormModal({ qcm, open, onOpenChange, onSave }) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [versionsCount, setVersionsCount] = useState(1)
  const [hasTimer, setHasTimer] = useState(false)
  const [timer, setTimer] = useState(30)
  const [successRate, setSuccessRate] = useState(50)
  const [questions, setQuestions] = useState([createDefaultQuestion()])

  useEffect(() => {
    if (qcm && open) {
      setTitle(qcm.title || "")
      setSubject(qcm.subject || "")
      setVersionsCount(qcm.versionsCount || 1)
      setHasTimer(!!qcm.timer)
      setTimer(qcm.timer || 30)
      setSuccessRate(qcm.successRate || 50)
      setQuestions(qcm.questions?.length > 0 ? qcm.questions : [createDefaultQuestion()])
    } else if (open) {
      setTitle("")
      setSubject("")
      setVersionsCount(1)
      setHasTimer(false)
      setTimer(30)
      setSuccessRate(50)
      setQuestions([createDefaultQuestion()])
    }
  }, [qcm, open])

  // --- Handlers Questions ---
  const addQuestion = () => setQuestions([...questions, createDefaultQuestion()])
  
  const removeQuestion = (idx) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== idx))
    }
  }

  const updateQuestion = (idx, updates) => {
    const newQuestions = [...questions]
    newQuestions[idx] = { ...newQuestions[idx], ...updates }
    setQuestions(newQuestions)
  }

  // --- Handlers Choix ---
  const addChoice = (qIdx) => {
    const newChoice = { id: generateId('c'), text: "", isCorrect: false }
    const updated = [...questions]
    updated[qIdx] = { 
      ...updated[qIdx], 
      choices: [...updated[qIdx].choices, newChoice] 
    }
    setQuestions(updated)
  }

  const removeChoice = (qIdx, cIdx) => {
    const updated = [...questions]
    if (updated[qIdx].choices.length > 2) {
      updated[qIdx] = {
        ...updated[qIdx],
        choices: updated[qIdx].choices.filter((_, i) => i !== cIdx),
      }
      setQuestions(updated)
    }
  }

  const updateChoice = (qIdx, cIdx, updates) => {
    const updated = [...questions]
    const updatedChoices = [...updated[qIdx].choices]
    updatedChoices[cIdx] = { ...updatedChoices[cIdx], ...updates }
    updated[qIdx] = { ...updated[qIdx], choices: updatedChoices }
    setQuestions(updated)
  }

  const handleSave = () => {
    onSave({
      ...(qcm?.id ? { id: qcm.id } : {}),
      title,
      subject,
      versionsCount,
      timer: hasTimer ? timer : null,
      successRate,
      questionsCount: questions.length,
      questions,
      status: qcm?.status || "draft",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-gray-200 bg-white p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {qcm ? "Modifier le Quiz" : "Créer un nouveau Quiz"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="flex flex-col gap-8 p-6">
            
            {/* 1. Informations Générales */}
            <section className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-indigo-600">
                Informations générales
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-700">Titre du Quiz</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Architecture des ordinateurs - Examen Final"
                    className="mt-2 border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Sujet / Matière</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="mt-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Choisir un sujet" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS_LIST.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Taux de réussite (%)</Label>
                  <Input
                    type="number"
                    value={successRate}
                    onChange={(e) => setSuccessRate(Number(e.target.value))}
                    className="mt-2 border-gray-200 bg-white"
                  />
                </div>
                <div className="flex flex-col justify-center gap-3 rounded-lg border border-dashed border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700">Activer un Timer</Label>
                    <Switch checked={hasTimer} onCheckedChange={setHasTimer} />
                  </div>
                  {hasTimer && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={timer}
                        onChange={(e) => setTimer(Number(e.target.value))}
                        className="h-8 border-gray-200 bg-white"
                      />
                      <span className="text-xs text-gray-500">minutes</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Versions (aléatoire)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={versionsCount}
                    onChange={(e) => setVersionsCount(Number(e.target.value))}
                    className="mt-2 border-gray-200 bg-white"
                  />
                </div>
              </div>
            </section>

            {/* 2. Builder de Questions */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Questions ({questions.length})
                </h3>
                <Button size="sm" onClick={addQuestion} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                  <Plus className="h-4 w-4" />
                  Ajouter une question
                </Button>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIdx) => (
                  <div
                    key={question.id}
                    className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 cursor-grab text-gray-300" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-xs font-bold text-indigo-600">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">Question {qIdx + 1}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Sélecteur de Type (Tabs style) */}
                        <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-1">
                          {typeOptions.map((opt) => {
                            const Icon = opt.icon
                            const isActive = question.type === opt.value
                            return (
                              <button
                                key={opt.value}
                                onClick={() => updateQuestion(qIdx, { type: opt.value })}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all rounded-md ${
                                  isActive 
                                    ? "bg-white text-indigo-600 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{opt.label}</span>
                              </button>
                            )
                          })}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeQuestion(qIdx)}
                          disabled={questions.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Input
                      value={question.content}
                      onChange={(e) => updateQuestion(qIdx, { content: e.target.value })}
                      placeholder="Intitulé de la question..."
                      className="mb-6 border-gray-200 text-base font-medium placeholder:font-normal focus:ring-indigo-500"
                    />

                    {/* Zone d'Upload simulée si non-texte */}
                    {question.type !== "text" && (
                      <div className="mb-6 flex h-24 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100">
                        <Plus className="h-6 w-6 opacity-50" />
                        <span className="text-xs font-medium">Ajouter un fichier {question.type}</span>
                      </div>
                    )}

                    {/* Réponses */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Réponses possibles</p>
                      {question.choices.map((choice, cIdx) => (
                        <div key={choice.id} className="flex items-center gap-3">
                          <Checkbox
                            checked={choice.isCorrect}
                            onCheckedChange={(checked) =>
                              updateChoice(qIdx, cIdx, { isCorrect: checked === true })
                            }
                            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                          <Input
                            value={choice.text}
                            onChange={(e) => updateChoice(qIdx, cIdx, { text: e.target.value })}
                            placeholder={`Réponse ${cIdx + 1}`}
                            className={`flex-1 border-gray-100 text-sm transition-all focus:border-indigo-300 ${
                              choice.isCorrect ? "bg-green-50/50 border-green-200" : "bg-white"
                            }`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                            onClick={() => removeChoice(qIdx, cIdx)}
                            disabled={question.choices.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addChoice(qIdx)}
                        className="mt-2 h-8 px-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Ajouter un choix
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 p-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-200 text-gray-600 hover:bg-white">
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title || !subject}
            className="bg-gray-900 px-8 text-white hover:bg-black disabled:opacity-50"
          >
            {qcm ? "Enregistrer les modifications" : "Créer le Quiz"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}