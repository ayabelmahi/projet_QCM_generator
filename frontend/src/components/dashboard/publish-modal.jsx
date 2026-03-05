"use client"

import React, { useState } from "react"
import {Dialog,DialogContent,DialogHeader,DialogTitle,} from "../ui_dashboard/dialog"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"
import { Label } from "../ui_dashboard/label"
import { Badge } from "../ui_dashboard/badge"
import { Separator } from "../ui_dashboard/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui_dashboard/tabs"
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

  // Vérifier si le QCM contient des médias incompatibles avec le PDF
  const hasMultimedia = qcm.questions?.some(
    (q) => q.type === "video" || q.type === "audio"
  )

  const addEmail = () => {
    if (emailInput && emailInput.includes("@")) {
      setEmails([...emails, emailInput.trim()])
      setEmailInput("")
    }
  }

  const removeEmail = (idx) => setEmails(emails.filter((_, i) => i !== idx))

  const handleCopyLink = () => {
    const shareLink = `http://localhost:5173/quiz/${qcm.id}` // Adapté à ton port local
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-gray-200 bg-white p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Publier : {qcm.title}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Choisissez le mode de publication de votre quiz
          </p>
        </DialogHeader>

        <Tabs defaultValue="web" className="mt-4">
          <TabsList className="mx-6 grid w-[calc(100%-48px)] grid-cols-2 bg-gray-100">
            <TabsTrigger value="web" className="gap-2 text-sm data-[state=active]:bg-white shadow-sm">
              <Globe className="h-4 w-4" />
              Web
            </TabsTrigger>
            <TabsTrigger value="pdf" className="gap-2 text-sm data-[state=active]:bg-white shadow-sm">
              <FileDown className="h-4 w-4" />
              PDF
            </TabsTrigger>
          </TabsList>

          {/* Onglet WEB */}
          <TabsContent value="web" className="p-6 pt-4">
            <div className="flex flex-col gap-5">
              {/* Lien de partage */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Lien de partage</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    <Link2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">http://localhost:5173/quiz/{qcm.id}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 border-gray-200"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copié" : "Copier"}
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-400">
                  <QrCode className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">QR Code</p>
                  <p className="text-xs text-gray-500">
                    Scannez ce code pour accéder directement au quiz
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs text-indigo-600 font-semibold">
                    Télécharger le QR Code
                  </Button>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Invitations Email */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Inviter par email</Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEmail()}
                    placeholder="candidat@email.com"
                    className="flex-1 border-gray-200 text-sm focus:ring-indigo-500"
                  />
                  <Button size="sm" variant="outline" onClick={addEmail} className="gap-1.5 border-gray-200">
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
                        className="gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none"
                      >
                        {email}
                        <button onClick={() => removeEmail(idx)} className="ml-1 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="h-4 w-4" />
                Envoyer les invitations ({emails.length})
              </Button>
            </div>
          </TabsContent>

          {/* Onglet PDF */}
          <TabsContent value="pdf" className="p-6 pt-4">
            <div className="flex flex-col gap-5">
              {hasMultimedia && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold">Contenu multimédia détecté</p>
                    <p className="text-xs opacity-90">
                      Ce quiz contient des éléments vidéo ou audio. Ils ne seront pas inclus dans le PDF.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-700">Nombre de copies</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={pdfCopies}
                  onChange={(e) => setPdfCopies(Number(e.target.value))}
                  className="mt-1.5 w-32 border-gray-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Chaque copie aura un ordre de questions aléatoire
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Un fichier <span className="font-bold text-gray-900">ZIP</span> contenant {pdfCopies} PDF(s) sera généré.
                </p>
              </div>

              <Button 
                className="w-full gap-2 bg-gray-900 hover:bg-black text-white" 
                disabled={hasMultimedia}
              >
                <FileDown className="h-4 w-4" />
                Générer les PDF
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}