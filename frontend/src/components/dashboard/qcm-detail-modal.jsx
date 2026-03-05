"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui_dashboard/dialog"
import { Badge } from "../ui_dashboard/badge"
import { Separator } from "../ui_dashboard/separator"
import { ScrollArea } from "../ui_dashboard/scroll-area"
import {
  CheckCircle2,
  XCircle,
  Timer,
  Target,
  Layers,
  Image,
  Video,
  Music,
  Type,
} from "lucide-react"

// Configuration des icônes par type de question
const typeIcons = {
  text: Type,
  image: Image,
  video: Video,
  audio: Music,
}

const typeLabels = {
  text: "Texte",
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
}

export function QCMDetailModal({ qcm, open, onOpenChange }) {
  // Sécurité si aucun QCM n'est passé
  if (!qcm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-gray-200 bg-white p-0 overflow-hidden">
        {/* Header du Modal */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {qcm.title}
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">{qcm.subject}</p>
            </div>
            <Badge
              className={
                qcm.status === "published"
                  ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-none"
              }
            >
              {qcm.status === "published" ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          {/* Statistiques rapides du Quiz */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Timer className="h-4 w-4 text-indigo-500" />
              {qcm.timer ? `${qcm.timer} min` : "Pas de timer"}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Target className="h-4 w-4 text-rose-500" />
              {qcm.successRate}% requis
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Layers className="h-4 w-4 text-amber-500" />
              {qcm.questionsCount || qcm.questions?.length || 0} question(s)
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4 bg-gray-100" />

        {/* Liste des questions */}
        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="flex flex-col gap-6">
            {qcm.questions && qcm.questions.map((question, idx) => {
              const Icon = typeIcons[question.type] || Type
              return (
                <div key={question.id || idx} className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
                  <div className="mb-4 flex items-start gap-3">
                    {/* Numéro de question */}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm">
                      {idx + 1}
                    </span>
                    
                    <div className="flex-1">
                      <div className="mb-1.5 flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 border-gray-200 bg-white text-[10px] uppercase tracking-wider">
                          <Icon className="h-3 w-3 text-gray-500" />
                          {typeLabels[question.type] || "Texte"}
                        </Badge>
                      </div>
                      <p className="text-base font-semibold text-gray-800">
                        {question.content}
                      </p>
                    </div>
                  </div>

                  {/* Liste des choix de réponse */}
                  <div className="ml-10 flex flex-col gap-2">
                    {question.choices && question.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                          choice.isCorrect
                            ? "bg-green-50 text-green-800 border border-green-100"
                            : "bg-white text-gray-600 border border-gray-100"
                        }`}
                      >
                        {choice.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-gray-300" />
                        )}
                        <span className={choice.isCorrect ? "font-medium" : ""}>
                          {choice.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}