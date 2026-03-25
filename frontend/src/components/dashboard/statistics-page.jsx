import { useMemo, useState } from "react"
import { Card } from "../ui_dashboard/card"
import { Progress } from "../ui_dashboard/progress"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui_dashboard/select"

import { Send, CheckCircle2, TrendingUp, Target } from "lucide-react"

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
  const [selectedQuizId, setSelectedQuizId] = useState("all")

  const publishedQuizzes = useMemo(
    () => quizzes.filter((q) => q.status === "published"),
    [quizzes]
  )

  const filteredQuizzes = useMemo(() => {
    if (selectedQuizId === "all") return quizzes
    return quizzes.filter((q) => String(q.id) === selectedQuizId)
  }, [quizzes, selectedQuizId])

  const totalQuizzes = filteredQuizzes.length

  const publishedCount = filteredQuizzes.filter(
    (q) => q.status === "published"
  ).length

  const avgSuccessRate =
    filteredQuizzes.length > 0
      ? Math.round(
        filteredQuizzes.reduce((acc, q) => acc + (q.successRate || 0), 0) /
        filteredQuizzes.length
      )
      : 0

  const timedQuizzes = filteredQuizzes.filter((q) => q.timer)
  const avgTimer =
    timedQuizzes.length > 0
      ? Math.round(
        timedQuizzes.reduce((acc, q) => acc + (q.timer || 0), 0) /
        timedQuizzes.length
      )
      : 0

  const publicationRate =
    totalQuizzes > 0 ? Math.round((publishedCount / totalQuizzes) * 100) : 0

  const subjectDistribution = useMemo(() => {
    const map = {}

    filteredQuizzes.forEach((q) => {
      const subject = q.subject || "Sans sujet"
      map[subject] = (map[subject] || 0) + 1
    })

    return Object.entries(map).map(([subject, count]) => ({
      subject,
      count,
    }))
  }, [filteredQuizzes])

  const successOverTime = useMemo(() => {
    return filteredQuizzes.map((q, index) => ({
      date: `Quiz ${index + 1}`,
      rate: q.successRate || 0,
    }))
  }, [filteredQuizzes])

  const kpis = [
    {
      label: "Quiz total",
      value: totalQuizzes,
      icon: Send,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Quiz publies",
      value: publishedCount,
      icon: CheckCircle2,
      color: "text-[hsl(142,71%,45%)]",
      bg: "bg-[hsl(142,71%,45%)]/10",
    },
    {
      label: "Taux requis moyen",
      value: `${avgSuccessRate}%`,
      icon: TrendingUp,
      color: "text-[hsl(250,50%,55%)]",
      bg: "bg-[hsl(250,50%,55%)]/10",
    },
    {
      label: "Temps moyen",
      value: `${avgTimer} min`,
      icon: Target,
      color: "text-[hsl(38,92%,50%)]",
      bg: "bg-[hsl(38,92%,50%)]/10",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Vue d'ensemble
          </h3>
          <p className="text-sm text-muted-foreground">
            Statistiques basees sur les QCM recuperes depuis l'API
          </p>
        </div>

        <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
          <SelectTrigger className="w-60 border-border bg-card">
            <SelectValue placeholder="Selectionner un quiz" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Tous les quiz</SelectItem>

            {publishedQuizzes.map((q) => (
              <SelectItem key={q.id} value={String(q.id)}>
                {q.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="group border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-card-foreground">
                  {kpi.value}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}
              >
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-card-foreground">
              Taux de publication
            </h4>
            <p className="text-xs text-muted-foreground">
              {publishedCount} sur {totalQuizzes} quiz sont publies
            </p>
          </div>

          <span className="font-display text-2xl font-bold text-primary">
            {publicationRate}%
          </span>
        </div>

        <Progress value={publicationRate} className="h-3" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card p-6 shadow-sm">
          <h4 className="mb-1 text-sm font-semibold text-card-foreground">
            Repartition par sujet
          </h4>

          <p className="mb-5 text-xs text-muted-foreground">
            Nombre de quiz par sujet
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(220, 13%, 91%)"
              />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                axisLine={{ stroke: "hsl(220, 13%, 91%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(221, 83%, 53%)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border/50 bg-card p-6 shadow-sm">
          <h4 className="mb-1 text-sm font-semibold text-card-foreground">
            Evolution du taux requis
          </h4>

          <p className="mb-5 text-xs text-muted-foreground">
            Selon les dates de creation des quiz
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={successOverTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(220, 13%, 91%)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                axisLine={{ stroke: "hsl(220, 13%, 91%)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(250, 50%, 55%)"
                strokeWidth={2.5}
                dot={{ fill: "hsl(250, 50%, 55%)", strokeWidth: 0, r: 5 }}
                activeDot={{
                  r: 7,
                  strokeWidth: 2,
                  stroke: "hsl(0, 0%, 100%)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}