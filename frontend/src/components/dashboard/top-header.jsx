import { Bell, Plus, Sparkles, Search } from "lucide-react"

import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"

export function TopHeader({ title, subtitle, onCreateQuiz, onCreateWithAI }) {
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
            className="h-9 w-64 border-border bg-background pl-9 text-sm"
          />
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

        {/* Notification */}
        {/* <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />

          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button> */}
      </div>
    </header>
  )
}