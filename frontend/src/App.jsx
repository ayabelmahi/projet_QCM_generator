import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import Index from "./pages/Index";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from "./pages/NotFound";
import QuizPage from "./pages/QuizPage";
import QuizDirectPage from "./pages/QuizDirectPage";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/quiz/:token" element={<QuizPage />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/quiz/direct/:id" element={<QuizDirectPage />} />
                </Routes>
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;