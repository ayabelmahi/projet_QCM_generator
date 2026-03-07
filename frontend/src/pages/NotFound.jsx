import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        // Log l'erreur pour le débogage en développement
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <div className="text-center animate-in fade-in zoom-in duration-300">
                <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
                <p className="mb-4 text-xl text-muted-foreground font-medium">
                    Oups ! Page introuvable
                </p>
                <p className="mb-8 text-sm text-muted-foreground/60">
                    Le chemin <span className="font-mono bg-accent px-1 rounded">{location.pathname}</span> n'existe pas.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Retourner à l'accueil
                </a>
            </div>
        </div>
    );
};

export default NotFound;