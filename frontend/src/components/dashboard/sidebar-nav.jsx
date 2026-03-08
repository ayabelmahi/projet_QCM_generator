import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  PlusCircle,
  ChevronRight,
  Loader2,
  Database,
} from "lucide-react";

import { cn } from "../../lib_dashboard/utils";
import { Badge } from "../ui_dashboard/badge";
import { Button } from "../ui_dashboard/button";

export function SidebarNav() {
  const { pathname } = useLocation();
  const [stats, setStats] = useState({ total: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarStats = async () => {
      try {
        // Exemple plus tard:
        // const response = await fetch('/api/quizzes/stats-summary')
        // const data = await response.json()
        // setStats({ total: data.total, drafts: data.drafts })

        setStats({ total: 12, drafts: 3 }); // simulation
      } catch (error) {
        console.error("Erreur stats sidebar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSidebarStats();
  }, []);

  const routes = [
    { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard", color: "text-indigo-500" },
    { label: "Mes Quiz", icon: FileText, href: "/dashboard/quizzes", color: "text-blue-500", count: stats.total },
    { label: "Statistiques", icon: BarChart3, href: "/dashboard/stats", color: "text-emerald-500" },
    { label: "Banque de Questions", icon: Database, href: "/dashboard/questions", color: "text-amber-500" },
    { label: "Paramètres", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      <div className="p-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">QuizApp</span>
        </div>

        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;

            return (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon
                    className={cn(
                      "h-5 w-5 mr-3 transition-colors",
                      isActive ? "text-indigo-600" : route.color || "text-gray-400"
                    )}
                  />
                  {route.label}
                </div>

                {route.count !== undefined && (
                  loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-gray-300" />
                  ) : (
                    <Badge
                      className={cn(
                        "ml-auto text-[10px] px-1.5 h-5 min-w-[20px] justify-center border-none shadow-none",
                        isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {route.count}
                    </Badge>
                  )
                )}

                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-2 text-indigo-400 lg:block hidden" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
        <Button
          className="w-full justify-start gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-indigo-600 hover:text-white transition-all rounded-xl shadow-sm h-10 group"
          asChild
        >
          <Link to="/dashboard/quizzes/new">
            <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold uppercase tracking-wider">Nouveau Quiz</span>
          </Link>
        </Button>

        {stats.drafts > 0 && (
          <p className="text-[10px] text-center mt-3 text-amber-600 font-medium animate-pulse">
            Vous avez {stats.drafts} brouillon{stats.drafts > 1 ? "s" : ""} en attente
          </p>
        )}
      </div>
    </div>
  );
}