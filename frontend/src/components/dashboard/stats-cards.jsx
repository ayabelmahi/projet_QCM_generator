"use client"

import React from "react"
import { 
  FileText, 
  Users, 
  Target, 
  Clock, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react"
import { Card } from "../ui_dashboard/card"

/**
 * @param {Array} quizzes - Liste des quiz (pour calcul local si besoin)
 * @param {Object} apiData - Données statistiques globales venant du backend
 */
export function StatsCards({ quizzes = [], apiData = null }) {
  
  // 1. Logique d'extraction des données (Priorité à l'API, sinon calcul local)
  const totalQuizzes = apiData?.totalQuizzes ?? quizzes.length
  const totalParticipants = apiData?.totalParticipants ?? 0
  
  const avgScore = apiData?.avgScore ?? (quizzes.length > 0
    ? Math.round(quizzes.reduce((acc, q) => acc + (q.successRate || 0), 0) / quizzes.length)
    : 0)

  const avgTime = apiData?.avgTime ?? (quizzes.filter(q => q.timer).length > 0
    ? Math.round(
        quizzes.filter(q => q.timer).reduce((acc, q) => acc + (q.timer || 0), 0) /
        quizzes.filter(q => q.timer).length
      )
    : 0)

  // 2. Configuration des cartes
  const statsConfig = [
    {
      label: "Total Quiz",
      value: totalQuizzes,
      trend: apiData?.trends?.quizzes ?? "+2",
      isPositive: true,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Participants",
      value: totalParticipants,
      trend: apiData?.trends?.participants ?? "+12%",
      isPositive: true,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Score Moyen",
      value: `${avgScore}%`,
      trend: apiData?.trends?.score ?? "+3%",
      isPositive: true,
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Temps Moyen",
      value: `${avgTime} min`,
      trend: apiData?.trends?.time ?? "-1 min",
      isPositive: false, // Moins de temps est souvent un signe d'efficacité
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card
          key={stat.label}
          className="group relative overflow-hidden border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-100"
        >
          <div className="flex items-start justify-between">
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
                {stat.value}
              </p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12 ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              stat.isPositive 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-amber-50 text-amber-600"
            }`}>
              {stat.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{stat.trend}</span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase">vs mois dernier</span>
          </div>

          {/* Effet décoratif discret au survol */}
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gray-50/50 transition-all duration-500 group-hover:scale-150 group-hover:bg-indigo-50/30" />
        </Card>
      ))}
    </div>
  )
}