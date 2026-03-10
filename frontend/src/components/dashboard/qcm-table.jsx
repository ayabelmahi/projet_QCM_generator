import { useState } from "react"
import {
  Eye,
  Pencil,
  Trash2,
  Send,
  BarChart3,
  Timer,
  Search,
  Filter,
} from "lucide-react"

import { Card } from "../ui_dashboard/card"
import { Badge } from "../ui_dashboard/badge"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui_dashboard/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui_dashboard/select"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui_dashboard/tooltip"

const subjects = [
  "Informatique",
  "Mathématiques",
  "Français",
  "Histoire",
  "Sciences",
  "Anglais",
]

export function QCMTable({ quizzes, onView, onEdit, onDelete, onPublish, onStats }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    const matchesSubject = subjectFilter === "all" || q.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesSubject
  })

  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-sm">
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-border bg-background pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36 border-border bg-background text-sm">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publie</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-9 w-40 border-border bg-background text-sm">
              <SelectValue placeholder="Sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sujets</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Titre
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sujet
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Questions
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Timer
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Taux requis
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Statut
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-40" />
                      <p className="text-sm font-medium">Aucun quiz trouve</p>
                      <p className="text-xs">Essayez de modifier vos filtres</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((qcm) => (
                  <TableRow
                    key={qcm.id}
                    className="cursor-pointer border-border/30 transition-colors hover:bg-muted/50"
                    onDoubleClick={() => onView(qcm)}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {qcm.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {qcm.versionsCount || 1} version(s)
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-accent text-accent-foreground text-xs font-medium"
                      >
                        {qcm.subject}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center text-sm text-card-foreground">
                      {qcm.questionsCount}
                    </TableCell>

                    <TableCell className="text-center">
                      {qcm.timer ? (
                        <Badge
                          variant="outline"
                          className="gap-1 border-border text-xs text-card-foreground"
                        >
                          <Timer className="h-3 w-3" />
                          {qcm.timer} min
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-sm font-medium text-card-foreground">
                      {qcm.successRate}%
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={qcm.status === "published" ? "default" : "secondary"}
                        className={
                          qcm.status === "published"
                            ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,45%)]/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {qcm.status === "published" ? "Publie" : "Brouillon"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {qcm.createdAt
                        ? new Date(qcm.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "--"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => onView(qcm)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Voir les details</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => onStats(qcm)}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Statistiques</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => onEdit(qcm)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Modifier</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => onDelete(qcm)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Supprimer</TooltipContent>
                        </Tooltip>

                        {qcm.status === "draft" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-[hsl(142,71%,45%)]"
                                onClick={() => onPublish(qcm)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Publier</TooltipContent>
                          </Tooltip>
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