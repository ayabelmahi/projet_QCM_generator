"use client"

import React, { useState, useEffect, useCallback } from "react"
// Imports de tes composants
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

const API_BASE_URL = "http://localhost:8090/api";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les Modals
  const [detailQcm, setDetailQcm] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formQcm, setFormQcm] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [publishQcm, setPublishQcm] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [statsQcm, setStatsQcm] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [deleteQcm, setDeleteQcm] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [candidateQuiz, setCandidateQuiz] = useState(null);

  // --- RÉCUPÉRATION DES DONNÉES (GET) ---
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/qcms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const items = data['hydra:member'] || [];
        
        // Adaptation des données Backend -> Frontend
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
        }));
        setQuizzes(formattedData);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // --- SAUVEGARDE (POST / PATCH) ---
  const handleSave = async (data) => {
    const token = localStorage.getItem('token');
    const isEdit = !!data.id;
    const url = isEdit ? `${API_BASE_URL}/qcms/${data.id}` : `${API_BASE_URL}/qcms`;
    
    // API Platform utilise PATCH avec un Content-Type spécifique
    const method = isEdit ? 'PATCH' : 'POST';
    const contentType = isEdit ? 'application/merge-patch+json' : 'application/json';

    const body = {
      title: data.title,
      subject: data.subject,
      timerSeconds: data.timer ? parseInt(data.timer) * 60 : null,
      successRate: parseInt(data.successRate) || 50,
      status: data.status || "draft"
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': contentType,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchQuizzes(); // Recharger la liste
        setFormOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  // --- SUPPRESSION (DELETE) ---
  const handleConfirmDelete = async () => {
    if (!deleteQcm) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/qcms/${deleteQcm.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setQuizzes(quizzes.filter((q) => q.id !== deleteQcm.id));
        setDeleteOpen(false);
        setDeleteQcm(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Handlers pour ouvrir les Modals
  const handleView = (qcm) => { setDetailQcm(qcm); setDetailOpen(true); };
  const handleEdit = (qcm) => { setFormQcm(qcm); setFormOpen(true); };
  const handleDelete = (qcm) => { setDeleteQcm(qcm); setDeleteOpen(true); };
  const handlePublish = (qcm) => { setPublishQcm(qcm); setPublishOpen(true); };
  const handleStats = (qcm) => { setStatsQcm(qcm); setStatsOpen(true); };
  const handleCreate = () => { setFormQcm(null); setFormOpen(true); };

  // Mode Candidat (Plein écran)
  if (candidateQuiz) {
    return <CandidateQuiz qcm={candidateQuiz} onBack={() => setCandidateQuiz(null)} />;
  }

  // Configuration des titres de page
  const pageTitles = {
    dashboard: { title: "Dashboard", subtitle: "Vue d'ensemble de vos quiz" },
    quizzes: { title: "Mes Quiz", subtitle: "Gérez et organisez vos quiz" },
    statistics: { title: "Statistiques", subtitle: "Analysez les performances" },
  };
  const config = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarNav activePage={activePage} onNavigate={setActivePage} />

      <div className="ml-64 flex flex-1 flex-col bg-gray-50/50">
        <TopHeader 
          title={config.title} 
          subtitle={config.subtitle} 
          onCreateQuiz={handleCreate} 
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
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
              {activePage === "statistics" && <StatisticsPage quizzes={quizzes} />}
            </div>
          )}
        </main>
      </div>

      {/* Les Modals */}
      <QCMDetailModal qcm={detailQcm} open={detailOpen} onOpenChange={setDetailOpen} />
      <QCMFormModal qcm={formQcm} open={formOpen} onOpenChange={setFormOpen} onSave={handleSave} />
      <PublishModal qcm={publishQcm} open={publishOpen} onOpenChange={setPublishOpen} />
      <StatsModal qcm={statsQcm} open={statsOpen} onOpenChange={setStatsOpen} />
      <DeleteDialog qcm={deleteQcm} open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleConfirmDelete} />
    </div>
  );
}