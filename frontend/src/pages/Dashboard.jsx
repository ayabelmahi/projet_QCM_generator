"use client"

import React, { useState, useEffect, useCallback } from "react"
import { AIGeneratorModal } from "../components/dashboard/AIGeneratorModal"

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
const handleUnauthorized = () => {
  localStorage.clear()
  window.location.href = "/login"
}
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
  const [saving, setSaving] = useState(false)
  const originalQuestionIdsRef = React.useRef([])
  const [aiModalOpen, setAiModalOpen] = useState(false)

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
      if (response.status === 401) {
        handleUnauthorized()
        return
      }


      if (response.ok) {
        const data = await response.json()

        const items = data["hydra:member"] || data.member || []

        const formattedData = items.map((q) => ({
          id: q.id.toString(),
          title: q.title,
          subject: q.subject,
          questionsCount: q.questions?.filter(q => !q.version_id)?.length || 0, // ← compte originales seulement
          timer: q.timerSeconds ? Math.floor(q.timerSeconds / 60) : null,
          successRate: q.successRate || 50,
          status: q.status || "draft",
          createdAt: q.createdAt || "",
          // ✅ Filtre uniquement les questions originales (version null)
          questions: q.questions?.filter(quest => quest.versionId === undefined) || [],
          versionsCount: q.versionsCount || 1,
        }))

        setQuizzes(formattedData)

        // BONUS
        console.log("Total:", data.totalItems)

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
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      if (data.id) {
        // ── PATCH le QCM ────────────────────────────────────────────────────
        await fetch(`${API_BASE_URL}/qcms/${data.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/merge-patch+json",
          },
          body: JSON.stringify({
            title: data.title,
            subject: data.subject,
            successRate: data.successRate,
            timerSeconds: data.timer ? data.timer * 60 : null,
          }),
        });

        // ── PATCH questions existantes + POST nouvelles ─────────────────────
        for (const question of data.questions || []) {
          if (question.apiId) {
            // ✅ PATCH question existante
            await fetch(`${API_BASE_URL}/questions/${question.apiId}`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/merge-patch+json",
              },
              body: JSON.stringify({
                content: question.content,
                type: question.type || "text",
              }),
            });

            // ✅ PATCH choices existants + POST nouveaux choices
            for (const choice of question.choices || []) {
              if (choice.apiId) {
                // PATCH choice existant
                await fetch(`${API_BASE_URL}/choices/${choice.apiId}`, {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/merge-patch+json",
                  },
                  body: JSON.stringify({
                    label: choice.text,
                    isCorrect: choice.isCorrect === true,
                  }),
                });
              } else {
                // POST nouveau choice dans question existante
                await fetch(`${API_BASE_URL}/choices`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/ld+json",
                  },
                  body: JSON.stringify({
                    label: choice.text,
                    isCorrect: choice.isCorrect === true,
                    question: `/api/questions/${question.apiId}`,
                  }),
                });
              }
            }

            // ✅ DELETE choices supprimés — après la boucle choices
            const originalQuestion = (formQcm?.questions || [])
              .find(q => String(q.apiId) === String(question.apiId));

            const originalChoiceIds = (originalQuestion?.choices || [])
              .map(c => String(c.apiId))
              .filter(Boolean);

            const currentChoiceIds = (question.choices || [])
              .map(c => String(c.apiId))
              .filter(Boolean);

            const deletedChoiceIds = originalChoiceIds
              .filter(id => !currentChoiceIds.includes(id));

            for (const id of deletedChoiceIds) {
              await fetch(`${API_BASE_URL}/choices/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            }

          } else {
            // ✅ POST nouvelle question
            const questionRes = await fetch(`${API_BASE_URL}/questions`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/ld+json",
              },
              body: JSON.stringify({
                content: question.content,
                type: question.type || "text",
                qcm: `/api/qcms/${data.id}`,
              }),
            });

            const createdQuestion = await questionRes.json();

            // ✅ POST choices de la nouvelle question
            for (const choice of question.choices || []) {
              await fetch(`${API_BASE_URL}/choices`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/ld+json",
                },
                body: JSON.stringify({
                  label: choice.text,
                  isCorrect: choice.isCorrect === true,
                  question: `/api/questions/${createdQuestion.id}`,
                }),
              });
            }
          }
        }

        // ── DELETE questions supprimées ──────────────────────────────────────
        const originalIds = originalQuestionIdsRef.current.map(id => String(id));

        const currentIds = (data.questions || [])
          .map(q => q.apiId)
          .filter(Boolean)
          .map(id => String(id));

        const deletedIds = originalIds.filter(id => !currentIds.includes(id));

        for (const id of deletedIds) {
          await fetch(`${API_BASE_URL}/questions/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        // ── Update UI ────────────────────────────────────────────────────────
        setQuizzes((prev) =>
          prev.map((q) =>
            q.id === data.id
              ? {
                ...q,
                title: data.title,
                subject: data.subject,
                successRate: data.successRate,
                timer: data.timer,
                questionsCount: data.questions?.length || 0,
              }
              : q
          )
        );

      } else {
        // ── CRÉATION ────────────────────────────────────────────────────────
        const qcmRes = await fetch(`${API_BASE_URL}/qcms`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
          body: JSON.stringify({
            title: data.title,
            subject: data.subject,
            successRate: data.successRate,
            timerSeconds: data.timer ? data.timer * 60 : null,
            status: "draft",
            author: "/api/users/1",
          }),
        });

        const qcm = await qcmRes.json();
        if (qcmRes.status === 401) { handleUnauthorized(); return; }

        for (const question of data.questions || []) {
          const questionRes = await fetch(`${API_BASE_URL}/questions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/ld+json",
            },
            body: JSON.stringify({
              content: question.content,
              type: question.type || "text",
              qcm: `/api/qcms/${qcm.id}`,
            }),
          });

          const createdQuestion = await questionRes.json();

          for (const choice of question.choices || []) {
            await fetch(`${API_BASE_URL}/choices`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/ld+json",
              },
              body: JSON.stringify({
                label: choice.text,
                isCorrect: choice.isCorrect === true,
                question: `/api/questions/${createdQuestion.id}`,
              }),
            });
          }
        }

        // ✅ UI mise à jour APRÈS que tout est sauvegardé
        setQuizzes((prev) => [
          {
            id: qcm.id.toString(),
            title: data.title,
            subject: data.subject,
            questionsCount: data.questions?.length || 0,
            timer: data.timer,
            successRate: data.successRate,
            status: "draft",
            createdAt: new Date().toISOString(),
            versionsCount: 1,
          },
          ...prev,
        ]);
      }

      alert("✅ Quiz sauvegardé avec succès");
      originalQuestionIdsRef.current = [];
      setFormOpen(false);

    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };


  // const handleSave = async (data) => {
  //   const token = localStorage.getItem("token");

  //   try
  //     //  créer QCM
  //     const qcmRes = await fetch(`${API_BASE_URL}/qcms`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/ld+json",
  //       },
  //       body: JSON.stringify({
  //         title: data.title,
  //         subject: data.subject,
  //         successRate: data.successRate,
  //         timerSeconds: data.timer ? data.timer * 60 : null,
  //         status: "draft",
  //         author: "/api/users/1",
  //       }),
  //     });

  //     const qcm = await qcmRes.json();

  //     // 2️⃣ créer questions + choices en parallèle 🚀
  //     await Promise.all(
  //       (data.questions || []).map(async (question) => {
  //         const questionRes = await fetch(`${API_BASE_URL}/questions`, {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/ld+json",
  //           },
  //           body: JSON.stringify({
  //             content: question.content,
  //             type: "text",
  //             qcm: `/api/qcms/${qcm.id}`,
  //           }),
  //         });

  //         const createdQuestion = await questionRes.json();

  //         await Promise.all(
  //           (question.choices || []).map(async (choice) => {
  //             return fetch(`${API_BASE_URL}/choices`, {
  //               method: "POST",
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "application/ld+json",
  //               },
  //               body: JSON.stringify({
  //                 label: choice.text,
  //                 isCorrect: choice.isCorrect === true,
  //                 question: `/api/questions/${createdQuestion.id}`,
  //               }),
  //             });
  //           })
  //         );
  //       })
  //     );

  //     // 3️⃣ UPDATE UI IMMÉDIAT 🔥 (PAS besoin reload)
  //     setQuizzes((prev) => [
  //       {
  //         id: qcm.id.toString(),
  //         title: data.title,
  //         subject: data.subject,
  //         questionsCount: data.questions?.length || 0,
  //         timer: data.timer,
  //         successRate: data.successRate,
  //         status: "draft",
  //         createdAt: new Date().toISOString(),
  //         versionsCount: 1,
  //       },
  //       ...prev,
  //     ]);

  //     // 4️⃣ feedback utilisateur
  //     alert("✅ Quiz créé avec succès");

  //     setFormOpen(false);

  //   } catch (error) {
  //     console.error("Erreur:", error);
  //     alert("❌ Erreur lors de la création");
  //   }
  // };

  const handleConfirmDelete = async () => {
    if (!deleteQcm) return

    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`${API_BASE_URL}/qcms/${deleteQcm.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 401) { handleUnauthorized(); return; }

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

  /* const handleEdit = (qcm) => {
     setFormQcm(qcm)
     setFormOpen(true)
   }
   */
  const handleEdit = async (qcm) => {
    const token = localStorage.getItem("token")

      setFormQcm({ ...qcm, questions: null })
      setFormOpen(true)

      try {
        const res = await fetch(`${API_BASE_URL}/qcms/${qcm.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/ld+json"
          }
        })
        if (res.status === 401) {
          handleUnauthorized()
          return
        }
        const data = await res.json()

        const questionsWithChoices = (data.questions || [])
          .filter(q => q.versionId === undefined) // ✅ filtre originales
          .map((q) => ({
          id: q.id.toString(),
          apiId: q.id, // ✅ pour le PATCH
          content: q.content || "",
          type: q.type || "text",
          choices: (q.choices || []).map((c) => ({
            id: c.id.toString(),
            apiId: c.id, // ✅ pour le PATCH
            text: c.label || "",
            isCorrect: c.correct ?? false, // ✅ API retourne "correct"
          }))
        }))

      originalQuestionIdsRef.current = questionsWithChoices.map(q => q.apiId)
      setFormQcm({ ...qcm, questions: questionsWithChoices })

    } catch (error) {
      console.error("Erreur chargement questions:", error)
    }
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
  const handleAIGenerated = (data) => {
    setFormQcm({
      title: data.title,
      subject: data.subject,
      questions: data.questions.map((q) => ({
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        content: q.content,
        type: q.type || "text",
        choices: q.choices.map((c) => ({
          id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: c.text,
          isCorrect: c.isCorrect,
        })),
      })),
    })
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
          //onCreateWithAI={() => console.log("Créer avec IA")}
          onCreateWithAI={() => setAiModalOpen(true)}
          onNavigate={setActivePage}
        />

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center italic text-gray-500">
              Chargement des données
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
      <AIGeneratorModal
          open={aiModalOpen}
          onOpenChange={setAiModalOpen}
          onGenerated={handleAIGenerated}
      />
    </div>
  )
}
