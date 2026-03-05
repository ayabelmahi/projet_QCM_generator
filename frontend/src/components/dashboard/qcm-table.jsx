"use client"

import React, { useState } from "react"
import {Eye,  Pencil,  Trash2,  Send,  BarChart3,Timer,  Search,  Filter,  Loader2} from "lucide-react"
import { Card } from "../ui_dashboard/card"
import { Badge } from "../ui_dashboard/badge"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"
import {Table,TableBody,  TableCell,  TableHead,  TableHeader,  TableRow,} from "../ui_dashboard/table"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "../ui_dashboard/select"
import {  Tooltip,  TooltipContent,  TooltipProvider,  TooltipTrigger,} from "../ui_dashboard/tooltip"

// Liste des sujets (peut être passée en props ou importée)
const SUBJECTS = ["Informatique", "Mathématiques", "Français", "Histoire", "Sciences", "Anglais"]

export function QCMTable({ 
  quizzes = [], 
  onView, 
  onEdit, 
  onDelete, 
  onPublish, 
  onStats,
  isLoading = false 
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  // Logique de filtrage côté client pour une réactivité immédiate
  const filtered = quizzes.filter((q) => {
    const title = q.title || ""
    const subject = q.subject || ""
    
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    const matchesSubject = subjectFilter === "all" || q.subject === subjectFilter
    
    return matchesSearch && matchesStatus && matchesSubject
  })

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
      {/* Barre de Filtres */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50/30">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-gray-200 bg-white pl-9 text-sm focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2 text-xs font-medium text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrer par :</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] border-gray-200 bg-white text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-9 w-[150px] border-gray-200 bg-white text-xs">
              <SelectValue placeholder="Sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sujets</SelectItem>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table des QCM */}
      <div className="relative overflow-x-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Titre & Versions</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Sujet</TableHead>
                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">Questions</TableHead>
                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">Timer</TableHead>
                <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">Statut</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date de création</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                      <p className="text-sm text-gray-500 font-medium">Chargement des quiz...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="h-8 w-8 opacity-20" />
                      <p className="text-sm font-medium">Aucun quiz trouvé</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((qcm) => (
                  <TableRow
                    key={qcm.id}
                    className="group border-gray-50 transition-colors hover:bg-indigo-50/30"
                  >
                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {qcm.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {qcm.versionsCount || 1} version(s) disponible(s)
                        </p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="rounded-md bg-white border border-gray-200 text-gray-600 text-[10px] font-bold">
                        {qcm.subject}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-center text-sm font-medium text-gray-700">
                      {qcm.questionsCount || qcm.questions?.length || 0}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {qcm.timer ? (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                          <Timer className="h-3 w-3 text-indigo-400" />
                          <span>{qcm.timer} min</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300">--</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none shadow-none ${
                          qcm.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {qcm.status === "published" ? "PUBLIÉ" : "BROUILLON"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-xs text-gray-500">
                      {qcm.createdAt 
                        ? new Date(qcm.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date inconnue"}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <ActionTooltip label="Visualiser">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => onView(qcm)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </ActionTooltip>

                        <ActionTooltip label="Statistiques">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => onStats(qcm)}>
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </ActionTooltip>

                        <ActionTooltip label="Modifier">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50" onClick={() => onEdit(qcm)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </ActionTooltip>

                        <ActionTooltip label="Supprimer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(qcm)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ActionTooltip>

                        {qcm.status === "draft" && (
                          <ActionTooltip label="Publier maintenant">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600 hover:bg-green-50" onClick={() => onPublish(qcm)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </ActionTooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </Card>
  )
}

// Petit composant helper pour les tooltips (plus propre)
function ActionTooltip({ children, label }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[10px] bg-gray-900 text-white border-none">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}