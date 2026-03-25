import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

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
  User,
} from "lucide-react"

export function PublishModal({ qcm, open, onOpenChange, onSuccess }) {
  const [candidates, setCandidates] = useState([]) // [{ email, name }]
  const [emailInput, setEmailInput] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [pdfCopies, setPdfCopies] = useState(1)
  const [copied, setCopied] = useState(false)

  if (!qcm) return null

  const hasMultimedia = qcm.questions?.some(
    (q) => q.type === "video" || q.type === "audio"
  )

  const addCandidate = () => {
    if (emailInput && emailInput.includes("@") && nameInput.trim()) {
      setCandidates([...candidates, { email: emailInput.trim(), name: nameInput.trim() }])
      setEmailInput("")
      setNameInput("")
    }
  }

  const removeCandidate = (idx) => {
    setCandidates(candidates.filter((_, i) => i !== idx))
  }

  const handleCopyLink = () => {
   // navigator.clipboard.writeText(`https://qsm-gen.app/quiz/${qcm.id}`)
    //navigator.clipboard.writeText(`${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/quiz/${qcm.id}`)
      navigator.clipboard.writeText(`${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/quiz/direct/${qcm.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvitations = async () => {
    if (candidates.length === 0) {
      alert("Ajoute au moins un candidat")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        `http://localhost:8090/api/qcms/${qcm.id}/publish`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "web",
            emails: candidates, // ✅ envoie [{ email, name }]
          }),
        }
      )

      const data = await response.json()
      console.log("Publication web :", data)

      if (!response.ok) {
        alert(data.message || "Erreur lors de l'envoi")
        return
      }

      // alert("Invitations créées avec succès")
      setCandidates([])
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur publication web :", error)
      alert("Erreur lors de la publication")
    }
  }
  const handleGeneratePdf = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        `http://localhost:8090/api/qcms/${qcm.id}/publish`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "pdf",
            copies: pdfCopies,
          }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        alert(data.message || "Erreur lors de la génération du PDF")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${qcm.title}_PDFs.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur génération PDF :", error)
      alert("Erreur lors de la génération du PDF")
    }
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
                <Label className="text-sm text-card-foreground">Lien de partage</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{`${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/quiz/direct/${qcm.id}`}</span>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 border-border" onClick={handleCopyLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copié" : "Copier"}
                  </Button>
                </div>
              </div>

              {/* QR CODE */}
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-background p-4">
                <div id="qr-code-container" className="flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-white p-1">
                  <QRCodeCanvas
                      //value={`http://localhost:5173/quiz/${qcm.id}`}
                      //value={`http://192.168.56.1:5173/quiz/${qcm.id}`}
                      //value={`${import.meta.env.VITE_APP_URL}/quiz/${qcm.id}`}
                      value={`${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/quiz/direct/${qcm.id}`}
                      //value={`${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/quiz/${qcm.id}`}
                      size={72}
                      level="H"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    Scannez ce code pour accéder directement au quiz
                  </p>
                  <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-primary"
                      onClick={() => {
                        const canvas = document.querySelector("#qr-code-container canvas")
                        if (canvas) {
                          const url = canvas.toDataURL("image/png")
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `qr-${qcm.title}.png`
                          a.click()
                        }
                      }}
                  >
                    Télécharger le QR Code
                  </Button>
                </div>
              </div>

              <Separator />

              {/* ✅ EMAIL + NOM */}
              <div>
                <Label className="text-sm text-card-foreground">Inviter par email</Label>
                <div className="mt-1.5 flex flex-col gap-2">
                  {/* Ligne nom */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCandidate()}
                        placeholder="Nom complet du candidat"
                        className="pl-9 border-border bg-background text-sm"
                      />
                    </div>
                  </div>
                  {/* Ligne email + bouton */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCandidate()}
                      placeholder="candidat@email.com"
                      className="flex-1 border-border bg-background text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addCandidate}
                      className="gap-1.5 border-border"
                      disabled={!emailInput.includes("@") || !nameInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                </div>

                {/* Liste candidats ajoutés */}
                {candidates.length > 0 && (
                    <div className="mt-3 flex flex-col gap-1.5 max-h-16 overflow-y-auto">
                    {candidates.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-card-foreground">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.email}</span>
                        </div>
                        <button onClick={() => removeCandidate(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="gap-2" onClick={handleSendInvitations}>
                <Send className="h-4 w-4" />
                Envoyer les invitations ({candidates.length})
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
                    <p className="text-sm font-medium text-card-foreground">Contenu multimédia détecté</p>
                    <p className="text-xs text-muted-foreground">
                      Ce quiz contient des éléments vidéo ou audio. Ces éléments ne seront pas inclus dans le PDF.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm text-card-foreground">Nombre de copies</Label>
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

              <Button className="gap-2" onClick={handleGeneratePdf} disabled={hasMultimedia}>
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