"use client"

import React, { useState, useEffect } from "react"
import { Bell, Plus, Sparkles, Search, Loader2 } from "lucide-react"
import { Button } from "../ui_dashboard/button"
import { Input } from "../ui_dashboard/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui_dashboard/dropdown-menu"

export function TopHeader({ 
  title, 
  subtitle, 
  onCreateQuiz, 
  onCreateWithAI,
  onSearch // Prop optionnelle pour lier la recherche à l'API
}) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false)

  // Adaptation API : Récupérer les notifications réelles (ex: nouveaux résultats de quiz)
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoadingNotifs(true)
      try {
        // Exemple d'appel API Symfony : /api/notifications/latest
        // const response = await fetch('/api/notifications/latest')
        // const data = await response.json()
        
        // Simulation
        const mockNotifs = [
          { id: 1, text: "Nouveau score sur 'PHP Basics'", time: "Il y a 2m" },
          { id: 2, text: "5 nouveaux candidats invités", time: "Il y a 1h" }
        ]
        setNotifications(mockNotifs)
        setUnreadCount(mockNotifs.length)
      } catch (error) {
        console.error("Erreur notifications:", error)
      } finally {
        setIsLoadingNotifs(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white/80 px-8 py-4 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Barre de Recherche Dynamique */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un quiz ou un candidat..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="h-9 w-64 border-gray-200 bg-gray-50/50 pl-9 text-xs focus:ring-indigo-500 transition-all focus:w-80"
          />
        </div>

        {/* Boutons d'Action Rapide */}
        <div className="flex items-center gap-2 border-l border-gray-100 pl-3 ml-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onCreateWithAI} 
            className="gap-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Générer avec IA</span>
          </Button>
          
          <Button 
            size="sm" 
            onClick={onCreateQuiz} 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Nouveau Quiz</span>
          </Button>
        </div>

        {/* Menu de Notifications avec API */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:bg-gray-50 hover:text-indigo-600 shadow-sm">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-80 p-2">
            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {isLoadingNotifs ? (
              <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-gray-300" /></div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start p-3 cursor-pointer rounded-lg hover:bg-indigo-50/50 focus:bg-indigo-50/50">
                  <span className="text-sm font-medium text-gray-900">{notif.text}</span>
                  <span className="text-[10px] text-gray-400 mt-1">{notif.time}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-500">Aucune notification</div>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs font-semibold text-indigo-600 cursor-pointer">
              Tout marquer comme lu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}