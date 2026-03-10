import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui_dashboard/dialog"

import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"
import { Label } from "../ui_dashboard/label"
import { Badge } from "../ui_dashboard/badge"
import { Separator } from "../ui_dashboard/separator"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui_dashboard/tabs"

import {
  Globe,
  FileDown,
  Send,
  AlertTriangle,
  Plus,
  X,
  QrCode,
  Link2,
  Copy,
  Check,
} from "lucide-react"

export function PublishModal({ qcm, open, onOpenChange }) {
  const [emails, setEmails] = useState([])
  const [emailInput, setEmailInput] = useState("")
  const [pdfCopies, setPdfCopies] = useState(1)
  const [copied, setCopied] = useState(false)

  if (!qcm) return null

  const hasMultimedia = qcm.questions?.some(
    (q) => q.type === "video" || q.type === "audio"
  )

  const addEmail = () => {
    if (emailInput && emailInput.includes("@")) {
      setEmails([...emails, emailInput.trim()])
      setEmailInput("")
    }
  }

  const removeEmail = (idx) => {
    setEmails(emails.filter((_, i) => i !== idx))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://qsm-gen.app/quiz/${qcm.id}`)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border bg-card p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-lg font-bold text-card-foreground">
            Publier : {qcm.title}
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Choisissez le mode de publication de votre quiz
          </p>
        </DialogHeader>

        <Tabs defaultValue="web" className="mt-4">
          <TabsList className="mx-6 grid w-[calc(100%-48px)] grid-cols-2 bg-muted">
            <TabsTrigger value="web" className="gap-2 text-sm data-[state=active]:bg-card">
              <Globe className="h-4 w-4" />
              Web
            </TabsTrigger>

            <TabsTrigger value="pdf" className="gap-2 text-sm data-[state=active]:bg-card">
              <FileDown className="h-4 w-4" />
              PDF
            </TabsTrigger>
          </TabsList>

          {/* WEB TAB */}
          <TabsContent value="web" className="p-6 pt-4">
            <div className="flex flex-col gap-5">

              {/* SHARE LINK */}
              <div>
                <Label className="text-sm text-card-foreground">
                  Lien de partage
                </Label>

                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      https://qsm-gen.app/quiz/{qcm.id}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-border"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}

                    {copied ? "Copié" : "Copier"}
                  </Button>
                </div>
              </div>

              {/* QR CODE */}
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
                  <QrCode className="h-10 w-10 text-muted-foreground/60" />
                </div>

                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    QR Code
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Scannez ce code pour accéder directement au quiz
                  </p>

                  <Button variant="link" className="h-auto p-0 text-xs text-primary">
                    Télécharger le QR Code
                  </Button>
                </div>
              </div>

              <Separator />

              {/* EMAIL */}
              <div>
                <Label className="text-sm text-card-foreground">
                  Inviter par email
                </Label>

                <div className="mt-1.5 flex items-center gap-2">
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEmail()}
                    placeholder="candidat@email.com"
                    className="flex-1 border-border bg-background text-sm"
                  />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addEmail}
                    className="gap-1.5 border-border"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>

                {emails.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {emails.map((email, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="gap-1 bg-primary/10 text-primary"
                      >
                        {email}

                        <button onClick={() => removeEmail(idx)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Envoyer les invitations ({emails.length})
              </Button>

            </div>
          </TabsContent>

          {/* PDF TAB */}
          <TabsContent value="pdf" className="p-6 pt-4">
            <div className="flex flex-col gap-5">

              {hasMultimedia && (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />

                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Contenu multimédia détecté
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Ce quiz contient des éléments vidéo ou audio.
                      Ces éléments ne seront pas inclus dans le PDF.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm text-card-foreground">
                  Nombre de copies
                </Label>

                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={pdfCopies}
                  onChange={(e) => setPdfCopies(Number(e.target.value))}
                  className="mt-1.5 w-32 border-border bg-background"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Chaque copie aura un ordre de questions aléatoire
                </p>
              </div>

              <div className="rounded-xl border border-border/50 bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  Un fichier <span className="font-medium text-card-foreground">ZIP</span>{" "}
                  contenant {pdfCopies} fichier(s) PDF sera téléchargé,
                  chacun avec un ordre de questions unique.
                </p>
              </div>

              <Button className="gap-2" disabled={hasMultimedia}>
                <FileDown className="h-4 w-4" />
                Générer {pdfCopies} PDF
              </Button>

            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}