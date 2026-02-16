import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    // 1. Déclaration des états pour stocker les saisies
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 2. Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setLoading(true);

        try {
            // Appel à API Platform (port 8090)
            const response = await axios.post('http://localhost:8090/api/users', {
                fullName: fullName,
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/ld+json'
                }
            });

            if (response.status === 201) {
                alert("Compte créé avec succès !");
                navigate('/login'); // Redirection vers la page de connexion
            }
        } catch (error) {
            console.error("Erreur d'inscription:", error.response?.data);
            alert("Erreur : " + (error.response?.data['hydra:description'] || "Une erreur est survenue"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl border-2 border-indigo-500 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <GraduationCap className="h-7 w-7" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold">Créer un compte</h1>
                    <p className="text-sm text-muted-foreground">QCM Generator Management</p>
                </div>

                {/* 3. Ajout de l'événement onSubmit */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom complet</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Jean Dupont"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Mise à jour de l'état
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="email"
                                placeholder="nom@exemple.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Mise à jour de l'état
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Mise à jour de l'état
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border/60 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 mt-6 transition-colors shadow-sm text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Traitement...' : 'S\'inscrire'} <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;