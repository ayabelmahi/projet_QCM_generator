import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui_dashboard/card";
import { Button } from "../ui_dashboard/button";
import { Badge } from "../ui_dashboard/badge";
import { Progress } from "../ui_dashboard/progress";
import { RadioGroup, RadioGroupItem } from "../ui_dashboard/radio-group";
import { Checkbox } from "../ui_dashboard/checkbox";
import { Clock, Image, Video, Music, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const typeIcons = {
  text: CheckCircle2,
  image: Image,
  video: Video,
  audio: Music,
};

export function CandidateQuiz({ qcm, onBack }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(qcm?.timer ? qcm.timer * 60 : 0);
  const [finished, setFinished] = useState(false);

  const question = qcm?.questions?.[currentQ];
  const correctCount = question?.choices?.filter((c) => c.isCorrect).length || 0;
  const isMultiple = correctCount > 1;
  const progressPercent = qcm?.questions?.length
    ? ((currentQ + 1) / qcm.questions.length) * 100
    : 0;

  useEffect(() => {
    if (!qcm?.timer || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, qcm?.timer, finished]);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleNext = () => {
    if (currentQ < qcm.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  const setAnswer = (questionId, choiceId, multiple) => {
    setAnswers((prev) => {
      if (multiple) {
        const current = prev[questionId] || [];
        if (current.includes(choiceId)) {
          return {
            ...prev,
            [questionId]: current.filter((c) => c !== choiceId),
          };
        }
        return {
          ...prev,
          [questionId]: [...current, choiceId],
        };
      }

      return {
        ...prev,
        [questionId]: [choiceId],
      };
    });
  };

  const calculateScore = () => {
    let correct = 0;

    qcm.questions.forEach((q) => {
      const userAnswers = answers[q.id] || [];
      const correctChoices = q.choices.filter((c) => c.isCorrect).map((c) => c.id);

      if (
        userAnswers.length === correctChoices.length &&
        userAnswers.every((a) => correctChoices.includes(a))
      ) {
        correct++;
      }
    });

    return Math.round((correct / qcm.questions.length) * 100);
  };

  if (finished) {
    const score = calculateScore();
    const passed = score >= qcm.successRate;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50 bg-card p-8 text-center shadow-lg">
          <div
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${
              passed ? "bg-[hsl(142,71%,45%)]/15" : "bg-destructive/15"
            }`}
          >
            {passed ? (
              <CheckCircle2 className="h-12 w-12 text-[hsl(142,71%,45%)]" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>

          <div className="mb-2 font-display text-5xl font-bold text-card-foreground">
            {score}%
          </div>

          <Badge
            className={`mb-4 text-sm ${
              passed
                ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)]"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {passed ? "Reussi" : "Echoue"}
          </Badge>

          <p className="mb-6 text-sm text-muted-foreground">
            {passed
              ? "Felicitations ! Vous avez atteint le score minimum requis."
              : `Le score minimum requis est de ${qcm.successRate}%. Vous n'avez pas atteint ce seuil.`}
          </p>

          <Button onClick={onBack} variant="outline" className="border-border">
            Retour au Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!question) return null;

  const Icon = typeIcons[question.type] || CheckCircle2;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-base font-bold text-card-foreground">
              {qcm.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              Question {currentQ + 1} sur {qcm.questions.length}
            </p>
          </div>

          {qcm.timer && (
            <Badge
              variant="outline"
              className={`gap-1.5 border-border text-sm font-mono ${
                timeLeft < 60 ? "border-destructive text-destructive" : "text-card-foreground"
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </Badge>
          )}
        </div>

        <div className="px-6 pb-3">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <Card className="flex-1 border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {currentQ + 1}
            </span>

            <Badge variant="outline" className="gap-1 border-border text-xs">
              <Icon className="h-3 w-3" />
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </Badge>

            {isMultiple && (
              <Badge variant="secondary" className="text-xs">
                Reponses multiples
              </Badge>
            )}
          </div>

          <h2 className="mb-8 text-lg font-semibold leading-relaxed text-card-foreground">
            {question.content}
          </h2>

          {question.type !== "text" && (
            <div className="mb-6 flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <Icon className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}

          {isMultiple ? (
            <div className="flex flex-col gap-3">
              {question.choices.map((choice) => {
                const selected = (answers[question.id] || []).includes(choice.id);

                return (
                  <label
                    key={choice.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm transition-all ${
                      selected
                        ? "border-primary bg-primary/5 text-card-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/30"
                    }`}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => setAnswer(question.id, choice.id, true)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    {choice.text}
                  </label>
                );
              })}
            </div>
          ) : (
            <RadioGroup
              value={(answers[question.id] || [])[0] || ""}
              onValueChange={(val) => setAnswer(question.id, val, false)}
              className="flex flex-col gap-3"
            >
              {question.choices.map((choice) => {
                const selected = (answers[question.id] || [])[0] === choice.id;

                return (
                  <label
                    key={choice.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm transition-all ${
                      selected
                        ? "border-primary bg-primary/5 text-card-foreground"
                        : "border-border bg-background text-card-foreground hover:border-primary/30"
                    }`}
                  >
                    <RadioGroupItem value={choice.id} />
                    {choice.text}
                  </label>
                );
              })}
            </RadioGroup>
          )}
        </Card>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} className="gap-2">
            {currentQ < qcm.questions.length - 1 ? "Suivant" : "Terminer"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}