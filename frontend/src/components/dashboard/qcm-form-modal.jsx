import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui_dashboard/dialog"
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

const subjects = [
  "Informatique",
  "Mathématiques",
  "Français",
  "Histoire",
  "Sciences",
  "Anglais",
]

const defaultQuestion = () => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: "text",
  content: "",
  choices: [
    { id: `c-${Date.now()}-1`, text: "", isCorrect: false },
    { id: `c-${Date.now()}-2`, text: "", isCorrect: false },
  ],
})

const typeOptions = [
  { value: "text", label: "Texte", icon: Type },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Music },
]

export function QCMFormModal({ qcm, open, onOpenChange, onSave }) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [versionsCount, setVersionsCount] = useState(1)
  const [hasTimer, setHasTimer] = useState(false)
  const [timer, setTimer] = useState(30)
  const [successRate, setSuccessRate] = useState(50)
  const [questions, setQuestions] = useState([defaultQuestion()])

  useEffect(() => {
    if (qcm && open) {
      setTitle(qcm.title || "")
      setSubject(qcm.subject || "")
      setVersionsCount(qcm.versionsCount || 1)
      setHasTimer(!!qcm.timer)
      setTimer(qcm.timer || 30)
      setSuccessRate(qcm.successRate || 50)
      //setQuestions(qcm.questions?.length > 0 ? qcm.questions : [defaultQuestion()])
      setQuestions(qcm.questions === null ? [] : qcm.questions?.length > 0 ? qcm.questions : [defaultQuestion()])
    } else if (open) {
      setTitle("")
      setSubject("")
      setVersionsCount(1)
      setHasTimer(false)
      setTimer(30)
      setSuccessRate(50)
      setQuestions([defaultQuestion()])
    }
  }, [qcm, open])

  const addQuestion = () => {
    setQuestions([...questions, defaultQuestion()])
  }

  const removeQuestion = (idx) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== idx))
    }
  }

  const updateQuestion = (idx, updates) => {
    setQuestions(questions.map((q, i) => (i === idx ? { ...q, ...updates } : q)))
  }

  const addChoice = (qIdx) => {
    const newChoice = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: "",
      isCorrect: false,
    }

    const updated = [...questions]
    updated[qIdx] = {
      ...updated[qIdx],
      choices: [...updated[qIdx].choices, newChoice],
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
    updated[qIdx] = {
      ...updated[qIdx],
      choices: updated[qIdx].choices.map((c, i) =>
        i === cIdx ? { ...c, ...updates } : c
      ),
    }
    setQuestions(updated)
  }

  const handleSave = () => {
    onSave({
      ...(qcm ? { id: qcm.id } : {}),
      title,
      subject,
      versionsCount,
      timer: hasTimer ? timer : null,
      successRate,
      questionsCount: questions.length,
      questions,
      status: qcm?.status || "draft",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-card p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-lg font-bold text-card-foreground">
            {qcm ? "Modifier le Quiz" : "Creer un nouveau Quiz"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="flex flex-col gap-6 p-6">
            <section className="rounded-xl border border-border/50 bg-background p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Informations generales
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label className="text-sm text-card-foreground">Titre du Quiz</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Mathematiques - Algebre Lineaire"
                    className="mt-1.5 border-border bg-card"
                  />
                </div>

                <div>
                  <Label className="text-sm text-card-foreground">Sujet</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Informatique"
                    className="mt-1.5 border-border bg-card"
                  />
                </div>

                {/* <div> */}
                  {/* <Label className="text-sm text-card-foreground">Nombre de versions</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={versionsCount}
                    onChange={(e) => setVersionsCount(Number(e.target.value))}
                    className="mt-1.5 border-border bg-card"
                  /> */}
                {/* </div> */}

                <div>
                  <Label className="text-sm text-card-foreground">Taux de reussite (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={successRate}
                    onChange={(e) => setSuccessRate(Number(e.target.value))}
                    className="mt-1.5 border-border bg-card"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-card-foreground">Timer</Label>
                    <Switch checked={hasTimer} onCheckedChange={setHasTimer} />
                  </div>

                  {hasTimer && (
                    <Input
                      type="number"
                      min={1}
                      value={timer}
                      onChange={(e) => setTimer(Number(e.target.value))}
                      placeholder="Duree en minutes"
                      className="mt-1.5 border-border bg-card"
                    />
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Questions ({questions.length})
                </h3>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={addQuestion}
                  className="gap-1.5 border-border text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une question
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {questions.map((question, qIdx) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-border/50 bg-background p-5 transition-shadow hover:shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/50" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                          {qIdx + 1}
                        </span>
                        <h4 className="text-sm font-medium text-card-foreground">
                          Question {qIdx + 1}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-border bg-card">
                          {typeOptions.map((opt) => {
                            const Icon = opt.icon
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateQuestion(qIdx, { type: opt.value })}
                                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors first:rounded-l-lg last:rounded-r-lg ${question.type === opt.value
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
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
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeQuestion(qIdx)}
                          disabled={questions.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Input
                      value={question.content}
                      onChange={(e) =>
                        updateQuestion(qIdx, { content: e.target.value })
                      }
                      placeholder="Saisissez votre question..."
                      className="mb-4 border-border bg-card"
                    />

                    {question.type !== "text" && (
                      <div className="mb-4 flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                        Glissez-deposez ou cliquez pour ajouter un fichier{" "}
                        {
                          typeOptions.find((t) => t.value === question.type)?.label.toLowerCase()
                        }
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Choix de reponse
                      </Label>

                      {question.choices.map((choice, cIdx) => (
                        <div key={choice.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={choice.isCorrect}
                            onCheckedChange={(checked) =>
                              updateChoice(qIdx, cIdx, {
                                isCorrect: checked === true,
                              })
                            }
                            className="data-[state=checked]:bg-[hsl(142,71%,45%)] data-[state=checked]:border-[hsl(142,71%,45%)]"
                          />

                          <Input
                            value={choice.text}
                            onChange={(e) =>
                              updateChoice(qIdx, cIdx, { text: e.target.value })
                            }
                            placeholder={`Choix ${cIdx + 1}`}
                            className="flex-1 border-border bg-card text-sm"
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeChoice(qIdx, cIdx)}
                            disabled={question.choices.length <= 2}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addChoice(qIdx)}
                        className="mt-1 w-fit gap-1.5 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Ajouter un choix
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex items-center justify-end gap-3 p-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Annuler
          </Button>

          <Button onClick={handleSave} disabled={!title || !subject}>
            {qcm ? "Enregistrer" : "Creer le Quiz"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}