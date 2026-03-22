import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react"

import { cn } from "../../lib_dashboard/utils"
import { useNavigate } from "react-router-dom"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "quizzes", label: "Mes Quiz", icon: FileText },
  // { id: "create", label: "Creer un Quiz", icon: PlusCircle },
  { id: "results", label: "Resultats", icon: BarChart3 },
  { id: "statistics", label: "Statistiques", icon: TrendingUp },
  // { id: "settings", label: "Parametres", icon: Settings },
]

export function SidebarNav({ activePage, onNavigate }) {
  const userEmail = localStorage.getItem('userEmail') || 'utilisateur@email.com'
  const initials = userEmail.slice(0, 2).toUpperCase()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }
  return (
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>

          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-sidebar-primary-foreground">
              QSM Generator
            </h1>
            <p className="text-xs text-sidebar-foreground/50">Quiz Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id

              return (
                  <li key={item.id}>
                    <button
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </button>
                  </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {initials}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-primary-foreground">
                {userEmail}
              </p>
              <p className="text-xs text-sidebar-foreground/50">
                {userEmail}
              </p>
            </div>
          </div>

          <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Deconnexion
          </button>
        </div>
      </aside>
  )
}