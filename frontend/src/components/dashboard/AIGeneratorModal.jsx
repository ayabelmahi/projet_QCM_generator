import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui_dashboard/dialog"
import { Button } from "../ui_dashboard/button"
import { Sparkles, Loader2 } from "lucide-react"

export function AIGeneratorModal({ open, onOpenChange, onGenerated }) {
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        setLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:8090/api/ai/generate-qcm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Erreur lors de la génération")
                return
            }

            onGenerated(data)
            onOpenChange(false)
            setPrompt("")

        } catch (err) {
            setError("Erreur de connexion au serveur")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg border-border bg-card p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold text-card-foreground">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Créer un Quiz avec l'IA
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 p-6">
                    <p className="text-sm text-muted-foreground">
                        Décrivez le quiz que vous souhaitez créer et l'IA le générera automatiquement.
                    </p>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ex: Crée un quiz de 5 questions sur l'algèbre linéaire avec 3 choix par question pour des étudiants débutants"
                        className="h-32 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-border"
                        >
                            Annuler
                        </Button>

                        <Button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Génération...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Générer
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}