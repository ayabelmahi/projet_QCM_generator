import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import des Providers et UI
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

// Import de tes pages
import Index from "./pages/Index";
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from "./pages/NotFound";

// Initialisation du client pour les requêtes API (React Query)
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {/* Les Toasters permettent d'afficher les notifications partout dans l'app */}
                <Toaster />
                <Sonner />

                <Router>
                    <Routes>
                        {/* Route d'accueil (Landing Page) */}
                        <Route path="/" element={<Index />} />

                        {/* Tes routes d'authentification conservées */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Gestion de l'erreur 404 - Toujours en dernier */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;