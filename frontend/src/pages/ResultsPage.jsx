import { useState, useEffect } from "react";

export default function ResultsPage() {
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/qcm_attempts", {
      headers: { Accept: "application/ld+json" },
    })
      .then((r) => r.json())
      .then((data) => setAttempts(data["hydra:member"] || []));
  }, []);

  const filtered = attempts.filter(
    (a) =>
      a.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      a.candidateEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-1">Résultats</h1>
      <p className="text-gray-500 mb-6">Consultez les résultats des candidats</p>

      <input
        type="text"
        placeholder="Rechercher un candidat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 border rounded-lg px-4 py-2 w-80 text-sm"
      />

      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez un candidat pour voir ses réponses et résultats :
      </p>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((attempt) => (
          <div
            key={attempt.id}
            onClick={() => setSelected(attempt)}
            className="border rounded-xl p-4 cursor-pointer hover:shadow-md transition"
          >
            <p className="font-semibold text-gray-800">{attempt.candidateName}</p>
            <p className="text-sm text-gray-500">{attempt.candidateEmail}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-400">
              <span>Score : {attempt.score ?? "--"}</span>
              <span>{attempt.passed ? "✅ Reçu" : "❌ Échoué"}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Quiz : {attempt.qcm?.title ?? "--"}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <CandidateModal attempt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function CandidateModal({ attempt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[560px] max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">{attempt.candidateName}</h2>
            <p className="text-sm text-gray-500">{attempt.candidateEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center flex-1">
            <p className="text-3xl font-bold text-blue-600">
              {attempt.score ?? "--"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Score</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center flex-1">
            <p className={`text-xl font-bold ${attempt.passed ? "text-green-600" : "text-red-500"}`}>
              {attempt.passed ? "Reçu ✅" : "Échoué ❌"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Résultat</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center flex-1">
            <p className="text-sm font-semibold text-gray-700">
              {attempt.qcm?.title ?? "--"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Quiz</p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Réponses</h3>
        <div className="space-y-3">
          {(attempt.answers || []).map((ans, i) => (
            <div
              key={ans.id}
              className={`rounded-lg p-3 text-sm border ${
                ans.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p className="font-medium text-gray-700">
                Q{i + 1} : {ans.question?.content ?? "Question"}
              </p>
              <p className="text-gray-500 mt-1">
                Réponse : {ans.choice?.label ?? "--"}{" "}
                {ans.isCorrect ? "✅" : "❌"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}