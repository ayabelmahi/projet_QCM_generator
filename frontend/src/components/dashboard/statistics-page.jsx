"use client"

import React, { useState, useEffect } from "react"
import { Card } from "../ui_dashboard/card"
import { Progress } from "../ui_dashboard/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui_dashboard/select"
import { 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Loader2,
  AlertCircle 
} from "lucide-react"
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

export function StatisticsPage({ quizzes = [] }) {
  const [selectedQuiz, setSelectedQuiz] = useState("all")
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Adaptation API : Récupération des statistiques depuis Symfony
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Construction de l'URL (Ex: /api/stats ou /api/stats?quizId=123)
        const url = selectedQuiz === "all" 
          ? "/api/statistics/global" 
          : `/api/statistics/quiz/${selectedQuiz}`;
        
        // Remplace par ton appel fetch réel :
        // const response = await fetch(url);
        // const data = await response.json();
        
        // Simulation de délais API et data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = {
          invitationsSent: 150,
          completedAttempts: 124,
          successRate: 78,
          averageScore: 65,
          scoreDistribution: [
            { range: "0-20", count: 5 },
            { range: "20-40", count: 15 },
            { range: "40-60", count: 30 },
            { range: "60-80", count: 45 },
            { range: "80-100", count: 29 },
          ],
          successOverTime: [
            { date: "Jan", rate: 65 },
            { date: "Fév", rate: 68 },
            { date: "Mar", rate: 75 },
            { date: "Avr", rate: 72 },
            { date: "Mai", rate: 78 },
          ]
        };
        
        setStats(mockData);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les statistiques.");
        console.error(err);
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [selectedQuiz])

  if (loading && !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 border-red-100 bg-red-50">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <p className="text-red-800 font-medium">{error}</p>
      </Card>
    )
  }

  const completionRate = stats ? Math.round((stats.completedAttempts / stats.invitationsSent) * 100) : 0

  const kpis = [
    { label: "Invitations envoyées", value: stats.invitationsSent, icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tentatives terminées", value: stats.completedAttempts, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Taux de réussite", value: `${stats.successRate}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Score moyen", value: `${stats.averageScore}%`, icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header & Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Analyse de Performance</h3>
          <p className="text-sm text-gray-500">Visualisez l'impact et les résultats de vos évaluations.</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-64 border-gray-200 bg-white shadow-sm focus:ring-indigo-500">
              <SelectValue placeholder="Sélectionner un quiz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les quiz (Global)</SelectItem>
              {quizzes.filter(q => q.status === "published").map((q) => (
                <SelectItem key={q.id} value={q.id.toString()}>{q.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Completion Progress */}
      <Card className="border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Taux de complétion</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Progression des candidats invités vers la fin du test.
            </p>
          </div>
          <span className="text-2xl font-black text-indigo-600">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-2 bg-gray-100" indicatorClassName="bg-indigo-600" />
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Score Distribution Chart */}
        <Card className="border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-900">Distribution des scores</h4>
            <p className="text-xs text-gray-500">Volume de candidats par tranche de note.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="range" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Success Over Time Chart */}
        <Card className="border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-900">Évolution du taux de réussite</h4>
            <p className="text-xs text-gray-500">Performance moyenne sur les 5 derniers mois.</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.successOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}