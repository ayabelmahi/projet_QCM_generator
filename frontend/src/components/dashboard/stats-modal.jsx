import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui_dashboard/dialog"

import { Card } from "../ui_dashboard/card"
import { Progress } from "../ui_dashboard/progress"

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

export function StatsModal({ qcm, open, onOpenChange }) {
  if (!qcm) return null

  const questions = qcm.questions || []

  const totalQuestions = questions.length
  const totalChoices = questions.reduce(
    (acc, question) => acc + (question.choices?.length || 0),
    0
  )

  const totalCorrectChoices = questions.reduce(
    (acc, question) =>
      acc +
      (question.choices?.filter((choice) => choice.isCorrect ?? choice.correct).length || 0),

    0
  )

  const timedValue = qcm.timer || 0
  const successRate = qcm.successRate || 0

  const multimediaQuestions = questions.filter(
    (q) => q.type === "image" || q.type === "video" || q.type === "audio"
  ).length

  const completionRate = totalQuestions > 0
    ? Math.round((totalCorrectChoices / totalChoices) * 100 || 0)
    : 0

  const kpis = [
    {
      label: "Questions",
      value: totalQuestions,
      icon: Send,
      color: "text-primary",
    },
    {
      label: "Choix corrects",
      value: totalCorrectChoices,
      icon: CheckCircle2,
      color: "text-[hsl(142,71%,45%)]",
    },
    {
      label: "Taux requis",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-[hsl(250,50%,55%)]",
    },
    {
      label: "Timer",
      value: timedValue ? `${timedValue} min` : "Aucun",
      icon: Target,
      color: "text-[hsl(38,92%,50%)]",
    },
  ]

  const distributionByQuestion = questions.map((question, index) => ({
    name: `Q${index + 1}`,
    count: question.choices?.length || 0,
  }))

  const correctnessByQuestion = questions.map((question, index) => ({
    name: `Q${index + 1}`,
    rate:
      question.choices?.length > 0
        ? Math.round(
            ((question.choices.filter((choice) => choice.isCorrect ?? choice.correct).length || 0) /
              question.choices.length) *
              100
          )
        : 0,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-card p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-lg font-bold text-card-foreground">
            Statistiques : {qcm.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 p-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="border-border/50 bg-background p-4">
                <div className="flex items-center gap-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {kpi.label}
                  </span>
                </div>

                <p className="mt-1 font-display text-xl font-bold text-card-foreground">
                  {kpi.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="border-border/50 bg-background p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-card-foreground">
                Structure du QCM
              </span>
              <span className="text-sm font-bold text-primary">
                {completionRate}%
              </span>
            </div>

            <Progress value={completionRate} className="h-2" />

            <p className="mt-1.5 text-xs text-muted-foreground">
              {totalCorrectChoices} choix corrects sur {totalChoices} choix au total
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {multimediaQuestions} question(s) avec media, {totalQuestions - multimediaQuestions} question(s) texte
            </p>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/50 bg-background p-4">
              <h4 className="mb-4 text-sm font-semibold text-card-foreground">
                Nombre de choix par question
              </h4>

              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={distributionByQuestion}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220, 13%, 91%)"
                  />

                  <XAxis
                    dataKey="name"
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
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-border/50 bg-background p-4">
              <h4 className="mb-4 text-sm font-semibold text-card-foreground">
                Pourcentage de bonnes reponses par question
              </h4>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={correctnessByQuestion}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220, 13%, 91%)"
                  />

                  <XAxis
                    dataKey="name"
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
                    strokeWidth={2}
                    dot={{ fill: "hsl(250, 50%, 55%)", strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}