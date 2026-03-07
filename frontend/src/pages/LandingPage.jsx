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
import { useState } from "react";
import { Link } from "react-router-dom"; // IMPORT INDISPENSABLE
import dashboardMockup from "../assets/dashboard-mockup.png";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
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
                    <a href="#cta" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Tarifs
                    </a>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {/* LIEN VERS LOGIN */}
                    <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                        Se connecter
                    </Link>
                    {/* LIEN VERS REGISTER */}
                    <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                        S'inscrire gratuitement
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-border bg-card px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-4">
                        <a href="#services" className="text-sm font-medium text-muted-foreground">Fonctionnalités</a>
                        <a href="#social" className="text-sm font-medium text-muted-foreground">Témoignages</a>
                        <a href="#cta" className="text-sm font-medium text-muted-foreground">Tarifs</a>
                        <hr className="border-border" />
                        <Link to="/login" className="text-left text-sm font-medium text-muted-foreground">Se connecter</Link>
                        <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground text-center">
                            S'inscrire gratuitement
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Hero = () => (
    <section className="relative overflow-hidden bg-background px-6 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                        <Zap className="h-3 w-3" />
                        Nouveau — Génération IA disponible
                    </div>
                    <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                        Créez des QCM intelligents{" "}
                        <span className="text-primary">en un clin d'œil</span>
                    </h1>
                    <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                        La plateforme tout-en-un qui simplifie la création, la gestion et
                        l'analyse de vos questionnaires. Conçue pour les éducateurs
                        exigeants.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        {/* LIEN VERS REGISTER */}
                        <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
                            Commencer gratuitement
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
                            Voir la démo
                        </button>
                    </div>
                </div>
                {/* ... reste du Hero identique ... */}
                <div className="animate-in fade-in zoom-in duration-1000 delay-200">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
                        <img
                            src={dashboardMockup}
                            alt="Dashboard QCM Generator"
                            className="relative rounded-xl border border-border shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ... Sections Services et SocialProof identiques ...
const services = [
    {
        icon: Zap,
        title: "Création Rapide",
        description:
            "Générateur intuitif de questions à choix multiples. Créez un QCM complet en quelques minutes grâce à notre éditeur intelligent.",
    },
    {
        icon: BarChart3,
        title: "Analyses Détaillées",
        description:
            "Suivi des scores et moyennes en temps réel. Identifiez les lacunes et adaptez votre enseignement grâce à des rapports visuels.",
    },
    {
        icon: Users,
        title: "Gestion d'Équipe",
        description:
            "Espace collaboratif pour enseignants et étudiants. Partagez des QCM, gérez les groupes et suivez la progression collective.",
    },
];

const Services = () => (
    <section id="services" className="bg-card px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                    Tout ce dont vous avez besoin
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Des outils puissants pour créer, distribuer et analyser vos
                    questionnaires.
                </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
                {services.map((service, i) => (
                    <div
                        key={service.title}
                        className="group rounded-xl border border-border bg-background p-8 transition-all hover:border-primary/30 hover:shadow-lg"
                    >
                        <div className="mb-5 inline-flex rounded-lg bg-accent p-3">
                            <service.icon className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                            {service.title}
                        </h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SocialProof = () => (
    <section id="social" className="bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2">
        <span className="text-sm font-medium text-foreground">
          Rejoint par plus de{" "}
            <span className="font-bold text-primary">1 200 utilisateurs</span>{" "}
            ce mois-ci
        </span>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
                {[
                    {
                        quote: "QCM Generator a transformé ma façon d'évaluer mes étudiants. Un gain de temps incroyable.",
                        name: "Marie D.",
                        role: "Professeure de Biologie",
                    },
                    {
                        quote: "Les analyses détaillées m'aident à identifier les difficultés de mes élèves instantanément.",
                        name: "Thomas L.",
                        role: "Formateur en entreprise",
                    },
                    {
                        quote: "L'espace collaboratif est parfait pour notre équipe pédagogique de 15 enseignants.",
                        name: "Sophie R.",
                        role: "Directrice pédagogique",
                    },
                ].map((testimonial) => (
                    <div
                        key={testimonial.name}
                        className="rounded-xl border border-border bg-card p-6 text-left"
                    >
                        <p className="leading-relaxed text-muted-foreground">
                            "{testimonial.quote}"
                        </p>
                        <div className="mt-4 border-t border-border pt-4">
                            <p className="font-heading text-sm font-semibold text-foreground">
                                {testimonial.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {testimonial.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CTABanner = () => (
    <section id="cta" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl bg-primary px-8 py-16 text-center md:px-16">
                <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
                    Prêt à révolutionner vos évaluations ?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
                    Rejoignez des milliers d'éducateurs qui font confiance à QCM
                    Generator pour leurs évaluations.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    {/* LIEN VERS REGISTER */}
                    <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-md transition-colors hover:bg-card/90">
                        Démarrer gratuitement
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                        Contacter l'équipe
                    </button>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="border-t border-border bg-card px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-heading text-sm font-semibold text-foreground">
          QCM Generator
        </span>
            </div>
            <p className="text-xs text-muted-foreground">
                © 2026 QCM Generator. Tous droits réservés.
            </p>
        </div>
    </footer>
);

const LandingPage = () => (
    <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Services />
        <SocialProof />
        <CTABanner />
        <Footer />
    </div>
);

export default LandingPage;