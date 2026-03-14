import { FileText, Users, Target, Clock } from "lucide-react"
import { Card } from "../ui_dashboard/card"

export function StatsCards({ quizzes }) {
  const totalQuizzes = quizzes.length

  const published = quizzes.filter((q) => q.status === "published").length

  const avgScore =
    quizzes.length > 0
      ? Math.round(
          quizzes.reduce((acc, q) => acc + (q.successRate || 0), 0) /
            quizzes.length
        )
      : 0

  const quizzesWithTimer = quizzes.filter((q) => q.timer)

  const avgTime =
    quizzesWithTimer.length > 0
      ? Math.round(
          quizzesWithTimer.reduce((acc, q) => acc + (q.timer || 0), 0) /
            quizzesWithTimer.length
        )
      : 0

  const stats = [
    {
      label: "Total Quiz",
      value: totalQuizzes,
      icon: FileText,
      color: "text-[hsl(221,83%,53%)]",
      bg: "bg-[hsl(221,83%,53%)]/10",
    },
    {
      label: "Participants",
      value: "342",
      icon: Users,
      color: "text-[hsl(142,71%,45%)]",
      bg: "bg-[hsl(142,71%,45%)]/10",
    },
    {
      label: "Score Moyen",
      value: `${avgScore}%`,
      icon: Target,
      color: "text-[hsl(250,50%,55%)]",
      bg: "bg-[hsl(250,50%,55%)]/10",
    },
    {
      label: "Temps Moyen",
      value: `${avgTime} min`,
      icon: Clock,
      color: "text-[hsl(38,92%,50%)]",
      bg: "bg-[hsl(38,92%,50%)]/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="group relative overflow-hidden border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>

              <p className="mt-1 font-display text-2xl font-bold text-card-foreground">
                {stat.value}
              </p>
            </div>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-medium text-[hsl(142,71%,45%)]">+12%</span>
            <span>vs mois dernier</span>
          </div>
        </Card>
      ))}
    </div>
  )
}