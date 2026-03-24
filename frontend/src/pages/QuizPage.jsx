import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8090";

function TimerBadge({ seconds, totalSeconds }) {
  const pct = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const r = 10;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color = seconds > totalSeconds * 0.4 ? "#4F6FE8" : seconds > totalSeconds * 0.2 ? "#F59E0B" : "#EF4444";
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8F9FA", border: "1px solid #E5E7EB", borderRadius: 10, padding: "6px 14px" }}>
      <svg width="28" height="28" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx="14" cy="14" r={r} fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
        <circle cx="14" cy="14" r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }} />
      </svg>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937", letterSpacing: "0.5px" }}>{mins}:{secs}</span>
    </div>
  );
}

function QuizScreen({ quiz, totalSeconds, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const questions = quiz.questions;
  const q = questions[current];
  const letters = ["A", "B", "C", "D", "E"];

  const finish = useCallback(async (expired = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/quiz/${quiz.token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const result = await res.json();
      onFinish({ score: result.score, total: result.total, percent: result.percent, passed: result.passed, timeExpired: expired });
    } catch {
      onFinish({ score: 0, total: questions.length, percent: 0, passed: false, timeExpired: expired });
    }
  }, [answers, questions.length, quiz.token, onFinish, submitting]);

  useEffect(() => {
    if (timeLeft <= 0) { finish(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finish]);

  const handleSelect = (choiceId) => {
    setSelected(choiceId);
    setAnswers(prev => ({ ...prev, [q.id]: choiceId }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      const next = current + 1;
      setCurrent(next);
      setSelected(answers[questions[next]?.id] ?? null);
    } else {
      finish(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      const prev = current - 1;
      setCurrent(prev);
      setSelected(answers[questions[prev]?.id] ?? null);
    }
  };

  const answered = Object.keys(answers).length;
  const progress = ((current + 1) / questions.length) * 100;

  if (submitting) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E5E7EB", borderTop: "3px solid #4F6FE8", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#6B7280", fontSize: 14 }}>Calcul du score...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#4F6FE8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>{quiz.title}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{quiz.subject}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F3F4F6", borderRadius: 8, padding: "6px 12px" }}>
            <div style={{ width: 28, height: 28, background: "#DBEAFE", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#1D4ED8" }}>
              {quiz.candidateName?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{quiz.candidateName}</span>
          </div>
          {totalSeconds > 0 && <TimerBadge seconds={timeLeft} totalSeconds={totalSeconds} />}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#E5E7EB" }}>
        <div style={{ height: "100%", background: "#4F6FE8", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#4F6FE8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Question {current + 1} / {questions.length}
          </span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
            {answered} réponse{answered > 1 ? "s" : ""} sur {questions.length}
          </span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "28px 28px 24px", marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600, color: "#111827", lineHeight: 1.5 }}>{q.content}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.choices.map((choice, idx) => {
              const isSelected = selected === choice.id;
              return (
                <button key={choice.id} onClick={() => handleSelect(choice.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, textAlign: "left", cursor: "pointer", transition: "all 0.15s", border: isSelected ? "2px solid #4F6FE8" : "1.5px solid #E5E7EB", background: isSelected ? "#EEF2FF" : "#fff", outline: "none" }}>
                  <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: isSelected ? "#4F6FE8" : "#F3F4F6", color: isSelected ? "#fff" : "#6B7280" }}>
                    {letters[idx]}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: isSelected ? "#1E3A8A" : "#374151" }}>{choice.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {questions.map((_, i) => (
            <div key={i} onClick={() => { setCurrent(i); setSelected(answers[questions[i]?.id] ?? null); }}
              style={{ height: 6, borderRadius: 3, cursor: "pointer", transition: "all 0.2s", width: i === current ? 20 : 6, background: i === current ? "#4F6FE8" : answers[questions[i]?.id] ? "#A5B4FC" : "#D1D5DB" }} />
          ))}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button onClick={handlePrev} disabled={current === 0}
            style={{ padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: current === 0 ? "not-allowed" : "pointer", border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", opacity: current === 0 ? 0.4 : 1 }}>
            ← Précédent
          </button>
          <button onClick={() => current === questions.length - 1 ? finish(false) : handleNext()}
            style={{ padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: current === questions.length - 1 ? "#059669" : "#4F6FE8", color: "#fff" }}>
            {current === questions.length - 1 ? "Terminer ✓" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ quiz, result }) {
  const pct    = result.percent ?? Math.round((result.score / result.total) * 100);
  const passed = result.passed  ?? pct >= 50;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "32px 28px", textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px", background: passed ? "#D1FAE5" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            {passed ? "🎉" : "😔"}
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#111827" }}>{passed ? "Félicitations !" : "Quiz terminé"}</h1>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B7280" }}>{quiz.candidateName} · {quiz.title}</p>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F4F6" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={passed ? "#059669" : "#EF4444"} strokeWidth="8" strokeDasharray={`${(pct / 100) * 314} 314`} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>{pct}%</span>
              <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{result.score}/{result.total}</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          {[{ label: "Bonnes réponses", value: result.score, color: "#059669" }, { label: "Mauvaises réponses", value: result.total - result.score, color: "#EF4444" }].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 1 ? "1px solid #F3F4F6" : "none" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Statut</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: passed ? "#D1FAE5" : "#FEE2E2", color: passed ? "#065F46" : "#991B1B" }}>
              {passed ? "Réussi ✓" : "Échoué ✗"}
            </span>
          </div>
          {result.timeExpired && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #F3F4F6", marginTop: 8 }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Raison</span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#FEF3C7", color: "#92400E" }}>Temps écoulé ⏱</span>
            </div>
          )}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", margin: 0 }}>Vous pouvez fermer cette page.</p>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const { token }           = useParams();
  const [phase, setPhase]   = useState("loading");
  const [quiz, setQuiz]     = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/api/quiz/${token}`)
      .then(res => { setQuiz({ ...res.data, token }); setPhase("quiz"); })
      .catch(() => { setError("Invitation introuvable ou expirée."); setPhase("error"); });
  }, [token]);

  const handleFinish = (resultData) => { setResult(resultData); setPhase("results"); };
  const totalSeconds = quiz?.timerSeconds ?? 30 * 60;

  if (phase === "loading") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <p style={{ color: "#9CA3AF", fontSize: 14 }}>Chargement du quiz...</p>
    </div>
  );

  if (phase === "error") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 32, margin: "0 0 12px" }}>⚠️</p>
        <p style={{ fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>Lien invalide</p>
        <p style={{ color: "#6B7280", fontSize: 13 }}>{error}</p>
      </div>
    </div>
  );

  if (phase === "quiz")    return <QuizScreen quiz={quiz} totalSeconds={totalSeconds} onFinish={handleFinish} />;
  if (phase === "results") return <ResultsScreen quiz={quiz} result={result} />;
}