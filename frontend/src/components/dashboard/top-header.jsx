import { useState } from "react"
import { Bell, Plus, Sparkles, Search } from "lucide-react"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"

const pages = [
  { id: "dashboard", label: "Dashboard" },
  { id: "quizzes", label: "Mes Quiz" },
  { id: "results", label: "Resultats" },
  { id: "statistics", label: "Statistiques" },
]

export function TopHeader({ title, subtitle, onCreateQuiz, onCreateWithAI, onNavigate }) {
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])

  const handleSearch = (value) => {
    setSearch(value)
    if (value.trim() === "") {
      setSuggestions([])
      return
    }
    const filtered = pages.filter((p) =>
        p.label.toLowerCase().includes(value.toLowerCase())
    )
    setSuggestions(filtered)
  }

  const handleSelect = (page) => {
    onNavigate(page.id)
    setSearch("")
    setSuggestions([])
  }

  return (
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-8 py-4 backdrop-blur-sm">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {title}
          </h2>
          {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-64 border-border bg-background pl-9 text-sm"
            />
            {suggestions.length > 0 && (
                <div className="absolute top-10 left-0 w-full rounded-lg border border-border bg-white shadow-md z-50">
                  {suggestions.map((page) => (
                      <button
                          key={page.id}
                          onClick={() => handleSelect(page)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors"
                      >
                        {page.label}
                      </button>
                  ))}
                </div>
            )}
          </div>

          {/* Create buttons */}
          <Button
              size="sm"
              variant="outline"
              onClick={onCreateWithAI}
              className="gap-2 text-accent-foreground"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Creer avec IA</span>
          </Button>

          <Button size="sm" onClick={onCreateQuiz} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Creer un Quiz</span>
          </Button>
        </div>
      </header>
  )
}