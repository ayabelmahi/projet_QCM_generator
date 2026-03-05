"use client"
import React, { useState, useEffect, useCallback } from "react"
import { Card } from "../ui_dashboard/card"
import { Button } from "../ui_dashboard/button"
import { Badge } from "../ui_dashboard/badge"
import { Progress } from "../ui_dashboard/progress"
import { RadioGroup, RadioGroupItem } from "../ui_dashboard/radio-group"
import { Checkbox } from "../ui_dashboard/checkbox"
import { Clock, Image, Video, Music, ArrowRight, CheckCircle2, XCircle } from "lucide-react"

const typeIcons = {
  text: CheckCircle2,
  image: Image,
  video: Video,
  audio: Music,
}

export function CandidateQuiz({ qcm, onBack }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(qcm.timer ? qcm.timer * 60 : 0)
  const [finished, setFinished] = useState(false)

  const question = qcm.questions[currentQ]
  const correctCount = question?.choices?.filter((c) => c.isCorrect).length || 0
  const isMultiple = correctCount > 1
  const progressPercent = qcm.questions.length > 0 
    ? ((currentQ + 1) / qcm.questions.length) * 100 
    : 0

  // Timer logic
  useEffect(() => {
    if (!qcm.timer || finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timeLeft, qcm.timer, finished])

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }, [])

  const handleNext = () => {
    if (currentQ < qcm.questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setFinished(true)
    }
  }

  const setAnswer = (questionId, choiceId, multiple) => {
    setAnswers((prev) => {
      if (multiple) {
        const current = prev[questionId] || []
        if (current.includes(choiceId)) {
          return { ...prev, [questionId]: current.filter((c) => c !== choiceId) }
        }
        return { ...prev, [questionId]: [...current, choiceId] }
      }
      return { ...prev, [questionId]: [choiceId] }
    })
  }

  const calculateScore = () => {
    let correct = 0
    qcm.questions.forEach((q) => {
      const userAnswers = answers[q.id] || []
      const correctChoices = q.choices.filter((c) => c.isCorrect).map((c) => c.id.toString())
      
      // On compare les IDs en string pour éviter les erreurs de type
      if (
        userAnswers.length === correctChoices.length &&
        userAnswers.every((a) => correctChoices.includes(a.toString()))
      ) {
        correct++
      }
    })
    return qcm.questions.length > 0 ? Math.round((correct / qcm.questions.length) * 100) : 0
  }

  // --- Page de Résultat ---
  if (finished) {
    const score = calculateScore()
    const passed = score >= qcm.successRate

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-gray-200 bg-white p-8 text-center shadow-lg">
          <div
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {passed ? (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>

          <div className="mb-2 text-5xl font-bold text-gray-900">
            {score}%
          </div>

          <Badge
            className={`mb-4 text-sm ${
              passed ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {passed ? "Réussi" : "Échoué"}
          </Badge>

          <p className="mb-6 text-sm text-gray-500">
            {passed
              ? "Félicitations ! Vous avez atteint le score minimum requis."
              : `Le score minimum requis est de ${qcm.successRate}%. Continuez vos efforts !`}
          </p>

          <Button onClick={onBack} variant="outline" className="w-full">
            Retour au Tableau de bord
          </Button>
        </Card>
      </div>
    )
  }

  // --- Page de Question ---
  if (!question) return null
  const Icon = typeIcons[question.type] || CheckCircle2

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header avec Progress Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-base font-bold text-gray-900">{qcm.title}</h1>
            <p className="text-xs text-gray-500">
              Question {currentQ + 1} sur {qcm.questions.length}
            </p>
          </div>
          {qcm.timer && (
            <Badge
              variant="outline"
              className={`gap-1.5 border-gray-200 text-sm font-mono ${
                timeLeft < 60 ? "border-red-500 text-red-600 animate-pulse" : "text-gray-700"
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>
        <div className="px-6 pb-3">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </header>

      {/* Zone de Question */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <Card className="flex-1 border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-600">
              {currentQ + 1}
            </span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Icon className="h-3 w-3" />
              {question.type}
            </Badge>
            {isMultiple && (
              <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-600">
                Plusieurs réponses possibles
              </Badge>
            )}
          </div>

          <h2 className="mb-8 text-xl font-semibold leading-relaxed text-gray-800">
            {question.content}
          </h2>

          {/* Réponses */}
          <div className="flex flex-col gap-3">
            {question.choices.map((choice) => {
              const selected = (answers[question.id] || []).includes(choice.id.toString())
              
              return (
                <label
                  key={choice.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-4 text-sm transition-all ${
                    selected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm"
                      : "border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {isMultiple ? (
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => setAnswer(question.id, choice.id.toString(), true)}
                    />
                  ) : (
                    <RadioGroup
                      value={(answers[question.id] || [])[0] || ""}
                      onValueChange={(val) => setAnswer(question.id, val, false)}
                    >
                      <div className="flex items-center space-x-2">
                         <RadioGroupItem value={choice.id.toString()} id={choice.id.toString()} />
                      </div>
                    </RadioGroup>
                  )}
                  <span className="flex-1">{choice.text}</span>
                </label>
              )
            })}
          </div>
        </Card>

        {/* Bouton Suivant */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleNext} 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            disabled={!(answers[question.id]?.length > 0)}
          >
            {currentQ < qcm.questions.length - 1 ? "Suivant" : "Terminer le test"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}