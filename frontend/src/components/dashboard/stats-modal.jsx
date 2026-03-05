"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui_dashboard/dialog"
import { Card } from "../ui_dashboard/card"
import { Progress } from "../ui_dashboard/progress"
import { Send, CheckCircle2, TrendingUp, Target, Loader2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function StatsModal({ qcm, open, onOpenChange }) {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Adaptation API : On charge les stats spécifiques au QCM quand la modale s'ouvre
  useEffect(() => {
    if (open && qcm?.id) {
      const fetchQuizStats = async () => {
        setIsLoading(true)
        try {
          // Exemple d'appel API Symfony : /api/quizzes/{id}/stats
          // const response = await fetch(`/api/quizzes/${qcm.id}/stats`)
          // const data = await response.json()
          
          // Simulation data
          await new Promise(r => setTimeout(r, 600))
          setStats({
            invitationsSent: 45,
            completedAttempts: 38,
            successRate: 72,
            averageScore: 68,
            scoreDistribution: [
              { range: "0-20", count: 2 },
              { range: "20-40", count: 4 },
              { range: "40-60", count: 10 },
              { range: "60-80", count: 18 },
              { range: "80-100", count: 4 },
            ],
            successOverTime: [
              { date: "Lun", rate: 60 },
              { date: "Mar", rate: 65 },
              { date: "Mer", rate: 70 },
              { date: "Jeu", rate: 72 },
              { date: "Ven", rate: 68 },
            ]
          })
        } catch (error) {
          console.error("Erreur lors du chargement des stats", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchQuizStats()
    }
  }, [open, qcm?.id])

  if (!qcm) return null

  const completionRate = stats ? Math.round((stats.completedAttempts / stats.invitationsSent) * 100) : 0

  const kpis = stats ? [
    { label: "Invitations", value: stats.invitationsSent, icon: Send, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Tentatives", value: stats.completedAttempts, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Taux réussite", value: `${stats.successRate}%`, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Score moyen", value: `${stats.averageScore}%`, icon: Target, color: "text-amber-500", bg: "bg-amber-50" },
  ] : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-none bg-white p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-gray-50/50 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-8 w-1 bg-indigo-600 rounded-full" />
            Statistiques : {qcm.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-gray-500">Analyse des données en cours...</p>
          </div>
        ) : stats ? (
          <div className="flex flex-col gap-6 p-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <Card key={kpi.label} className="border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                      <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{kpi.label}</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                </Card>
              ))}
            </div>

            {/* Completion Progress */}
            <Card className="border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Taux de complétion</h4>
                  <p className="text-[11px] text-gray-500">{stats.completedAttempts} sur {stats.invitationsSent} candidats ont terminé</p>
                </div>
                <span className="text-xl font-black text-indigo-600">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2.5 bg-gray-100" />
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Score Distribution */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Distribution des scores</h4>
                <div className="h-[200px] w-full border border-gray-50 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 10, fill: "#94a3b8" }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                      />
                      <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance (7j)</h4>
                <div className="h-[200px] w-full border border-gray-50 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.successOverTime}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: "#94a3b8" }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">Aucune donnée disponible.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}