import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    GraduationCap,
    Zap,
    BarChart3,
    Users,
    ArrowRight,
    CheckCircle2,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
    console.log("Coucou, je suis sur la Home !");
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-7 w-7 text-primary" />
                        <span className="font-heading text-xl font-bold text-foreground">
              QCM Generator
            </span>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-8 md:flex">
                        <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Fonctionnalités
                        </a>
                        <a href="#social" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Témoignages
                        </a>
                    </div>

                    <div className="hidden items-center gap-3 md:flex">
                        {/* On utilise Link pour rediriger vers tes pages existantes */}
                        <Button variant="ghost" asChild>
                            <Link to="/login">Se connecter</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/register">Démarrer gratuitement</Link>
                        </Button>
                    </div>

                    {/* Mobile toggle */}
                    <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="border-t border-border bg-card px-6 py-4 md:hidden">
                        <div className="flex flex-col gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground">Se connecter</Link>
                            <Button asChild className="w-full">
                                <Link to="/register">Démarrer gratuitement</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-background px-6 pb-16 pt-20 md:pb-24 md:pt-28">
                <div className="mx-auto max-w-6xl text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                        <Zap className="h-3 w-3" />
                        Nouveau — Génération IA disponible
                    </div>
                    <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
                        Créez des QCM intelligents <span className="text-primary">en un clin d'œil</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                        La plateforme tout-en-un qui simplifie la création, la gestion et
                        l'analyse de vos questionnaires. Conçue pour les éducateurs exigeants.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="gap-2" asChild>
                            <Link to="/register">
                                Commencer gratuitement <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline">
                            Voir la démo
                        </Button>
                    </div>
                    <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Gratuit pour commencer
            </span>
                        <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Sans carte bancaire
            </span>
                    </div>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section id="services" className="bg-card px-6 py-20">
                <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30">
                        <div className="mb-5 inline-flex rounded-lg bg-accent p-3">
                            <Zap className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold">Création Rapide</h3>
                        <p className="mt-2 text-muted-foreground">Générateur intuitif de QCM complet en quelques minutes.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30">
                        <div className="mb-5 inline-flex rounded-lg bg-accent p-3">
                            <BarChart3 className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold">Analyses Détaillées</h3>
                        <p className="mt-2 text-muted-foreground">Suivi des scores et moyennes en temps réel pour vos élèves.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30">
                        <div className="mb-5 inline-flex rounded-lg bg-accent p-3">
                            <Users className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold">Gestion d'Équipe</h3>
                        <p className="mt-2 text-muted-foreground">Espace collaboratif pour enseignants et étudiants.</p>
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl bg-primary px-8 py-16 text-center md:px-16 text-primary-foreground">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Prêt à révolutionner vos évaluations ?
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-lg opacity-80">
                            Rejoignez des milliers d'éducateurs qui nous font confiance.
                        </p>
                        <Button size="lg" variant="secondary" className="mt-8" asChild>
                            <Link to="/register">Démarrer gratuitement</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <footer className="border-t border-border bg-card px-6 py-10 text-center">
                <p className="text-xs text-muted-foreground">© 2026 QCM Generator. Tous droits réservés.</p>
            </footer>
        </div>
    );
};

export default Home;