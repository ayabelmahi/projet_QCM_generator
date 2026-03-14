"use client"

import React, { useState, useEffect, useCallback } from "react"

// Components
import { SidebarNav } from "../components/dashboard/sidebar-nav"
import { TopHeader } from "../components/dashboard/top-header"
import { StatsCards } from "../components/dashboard/stats-cards"
import { QCMTable } from "../components/dashboard/qcm-table"
import { QCMDetailModal } from "../components/dashboard/qcm-detail-modal"
import { QCMFormModal } from "../components/dashboard/qcm-form-modal"
import { PublishModal } from "../components/dashboard/publish-modal"
import { StatsModal } from "../components/dashboard/stats-modal"
import { DeleteDialog } from "../components/dashboard/delete-dialog"
import { StatisticsPage } from "../components/dashboard/statistics-page"
import { CandidateQuiz } from "../components/dashboard/candidate-quiz"

const API_BASE_URL = "http://localhost:8090/api"

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard")
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [detailQcm, setDetailQcm] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [formQcm, setFormQcm] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [publishQcm, setPublishQcm] = useState(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [statsQcm, setStatsQcm] = useState(null)
  const [statsOpen, setStatsOpen] = useState(false)
  const [deleteQcm, setDeleteQcm] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [candidateQuiz, setCandidateQuiz] = useState(null)

  const fetchQuizzes = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/qcms`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/ld+json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const items = data["hydra:member"] || []

        const formattedData = items.map((q) => ({
          id: q.id.toString(),
          title: q.title,
          subject: q.subject,
          questionsCount: q.questions ? q.questions.length : 0,
          timer: q.timerSeconds ? Math.floor(q.timerSeconds / 60) : null,
          successRate: q.successRate || 50,
          status: q.status || "draft",
          createdAt: q.createdAt ? q.createdAt.split("T")[0] : "",
          questions: q.questions || [],
          versionsCount: q.versionsCount || 1,
        }))

        setQuizzes(formattedData)
      }
    } catch (error) {
      console.error("Erreur API:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  const handleSave = async (data) => {
    const token = localStorage.getItem("token")
    const isEdit = !!data.id
    const url = isEdit ? `${API_BASE_URL}/qcms/${data.id}` : `${API_BASE_URL}/qcms`
    const method = isEdit ? "PATCH" : "POST"
    const contentType = isEdit ? "application/merge-patch+json" : "application/json"

    const body = {
      title: data.title,
      subject: data.subject,
      timerSeconds: data.timer ? parseInt(data.timer) * 60 : null,
      successRate: parseInt(data.successRate) || 50,
      status: data.status || "draft",
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": contentType,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchQuizzes()
        setFormOpen(false)
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteQcm) return

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_BASE_URL}/qcms/${deleteQcm.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== deleteQcm.id))
        setDeleteOpen(false)
        setDeleteQcm(null)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const handleView = (qcm) => {
    setDetailQcm(qcm)
    setDetailOpen(true)
  }

  const handleEdit = (qcm) => {
    setFormQcm(qcm)
    setFormOpen(true)
  }

  const handleDelete = (qcm) => {
    setDeleteQcm(qcm)
    setDeleteOpen(true)
  }

  const handlePublish = (qcm) => {
    setPublishQcm(qcm)
    setPublishOpen(true)
  }

  const handleStats = (qcm) => {
    setStatsQcm(qcm)
    setStatsOpen(true)
  }

  const handleCreate = () => {
    setFormQcm(null)
    setFormOpen(true)
  }

  if (candidateQuiz) {
    return <CandidateQuiz qcm={candidateQuiz} onBack={() => setCandidateQuiz(null)} />
  }

  const pageTitles = {
    dashboard: { title: "Dashboard", subtitle: "Vue d'ensemble de vos quiz" },
    quizzes: { title: "Mes Quiz", subtitle: "Gérez et organisez vos quiz" },
    create: { title: "Créer un Quiz", subtitle: "Concevez un nouveau quiz" },
    results: { title: "Résultats", subtitle: "Consultez les résultats des candidats" },
    statistics: { title: "Statistiques", subtitle: "Analysez les performances" },
    settings: { title: "Paramètres", subtitle: "Configuration de l'application" },
  }

  const config = pageTitles[activePage] || pageTitles.dashboard

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNav activePage={activePage} onNavigate={setActivePage} />

      <div className="ml-64 flex flex-1 flex-col bg-gray-50/50">
        <TopHeader
          title={config.title}
          subtitle={config.subtitle}
          onCreateQuiz={handleCreate}
          onCreateWithAI={() => console.log("Créer avec IA")}
        />

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center italic text-gray-500">
              Chargement des données Symfony...
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {activePage === "dashboard" && (
                <>
                  <StatsCards quizzes={quizzes} />
                  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">Quiz récents</h3>
                    <QCMTable
                      quizzes={quizzes}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPublish={handlePublish}
                      onStats={handleStats}
                    />
                  </div>
                </>
              )}

              {activePage === "quizzes" && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <QCMTable
                    quizzes={quizzes}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onStats={handleStats}
                  />
                </div>
              )}

              {activePage === "create" && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-gray-800">Créer un nouveau quiz</h3>
                    <p className="text-sm text-gray-500">
                      Cliquez sur le bouton ci-dessous pour ouvrir le formulaire de création.
                    </p>
                    <button
                      onClick={handleCreate}
                      className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Nouveau Quiz
                    </button>
                  </div>
                </div>
              )}

              {activePage === "results" && (
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-gray-500">
                    Sélectionnez un quiz publié pour simuler l'expérience candidat :
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quizzes
                      .filter((q) => q.status === "published")
                      .map((qcm) => (
                        <div
                          key={qcm.id}
                          className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                          onClick={() => setCandidateQuiz(qcm)}
                        >
                          <h3 className="text-base font-semibold text-gray-900">{qcm.title}</h3>
                          <p className="mt-2 text-sm text-gray-500">{qcm.subject}</p>
                          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                            <span>{qcm.questionsCount} questions</span>
                            <span>{qcm.timer ? `${qcm.timer} min` : "--"}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activePage === "statistics" && <StatisticsPage quizzes={quizzes} />}

              {activePage === "settings" && (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-gray-800">Paramètres</h3>
                  <p className="text-sm text-gray-500">
                    Cette section sera reliée plus tard aux paramètres réels.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <QCMDetailModal qcm={detailQcm} open={detailOpen} onOpenChange={setDetailOpen} />
      <QCMFormModal qcm={formQcm} open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      <PublishModal qcm={publishQcm} open={publishOpen} onOpenChange={setPublishOpen} />
      <StatsModal qcm={statsQcm} open={statsOpen} onOpenChange={setStatsOpen} />
      <DeleteDialog
        qcm={deleteQcm}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}