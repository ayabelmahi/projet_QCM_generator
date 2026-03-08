import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import des Providers et UI
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

// Import de tes pages
import Index from "./pages/Index";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>

                    <Routes>
                        {/* Landing Page */}
                        <Route path="/" element={<Index />} />

                        {/* Authentification */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Dashboard */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Erreur 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>

                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;