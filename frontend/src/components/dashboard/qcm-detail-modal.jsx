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

const typeIcons = {
  text: Type,
  image: Image,
  video: Video,
  audio: Music,
}

const typeLabels = {
  text: "Texte",
  image: "Image",
  video: "Video",
  audio: "Audio",
}

export function QCMDetailModal({ qcm, open, onOpenChange }) {
  if (!qcm) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card p-0">
        <DialogHeader className="p-6 pb-0">

          <div className="flex items-start justify-between">

            <div>
              <DialogTitle className="font-display text-lg font-bold text-card-foreground">
                {qcm.title}
              </DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {qcm.subject}
              </p>
            </div>

            <Badge
              className={
                qcm.status === "published"
                  ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)]"
                  : "bg-muted text-muted-foreground"
              }
            >
              {qcm.status === "published" ? "Publie" : "Brouillon"}
            </Badge>

          </div>

          <div className="mt-4 flex items-center gap-4">

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              {qcm.timer ? `${qcm.timer} min` : "Pas de timer"}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              {qcm.successRate}% requis
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              {qcm.versionsCount} version(s)
            </div>

          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <ScrollArea className="max-h-[50vh] px-6 pb-6">

          <div className="flex flex-col gap-4">

            {qcm.questions.map((question, idx) => {
              const Icon = typeIcons[question.type]

              return (
                <div
                  key={question.id}
                  className="rounded-xl border border-border/50 bg-background p-4"
                >

                  <div className="mb-3 flex items-start gap-3">

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>

                    <div className="flex-1">

                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 border-border text-xs">
                          <Icon className="h-3 w-3" />
                          {typeLabels[question.type]}
                        </Badge>
                      </div>

                      <p className="text-sm font-medium text-card-foreground">
                        {question.content}
                      </p>

                    </div>

                  </div>

                  <div className="ml-10 flex flex-col gap-1.5">

                    {question.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          choice.isCorrect
                            ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,38%)] font-medium"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >

                        {choice.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(142,71%,45%)]" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 opacity-40" />
                        )}

                        {choice.text}

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