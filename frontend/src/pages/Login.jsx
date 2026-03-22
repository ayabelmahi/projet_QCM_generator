import React, { useState } from 'react';
import { Mail, Lock, LogIn, GraduationCap } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ✅ Déjà connecté → redirige directement vers le dashboard
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8090/api/login_check', {
                email: email,
                password: password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', email);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Erreur de connexion:", err.response?.data);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-border/60 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">Bon retour</h1>
                    <p className="text-sm text-muted-foreground">Connectez-vous à votre espace</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="email"
                                placeholder="nom@exemple.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 mt-6 transition-colors shadow-sm text-sm ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'} <LogIn className="h-4 w-4" />
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-muted-foreground">
                    Nouveau ici ?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;