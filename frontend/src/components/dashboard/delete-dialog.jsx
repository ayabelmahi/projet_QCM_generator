import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui_dashboard/alert-dialog"

import { AlertTriangle } from "lucide-react"

export function DeleteDialog({ qcm, open, onOpenChange, onConfirm }) {
  if (!qcm) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>

          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <AlertDialogTitle className="text-center font-display text-card-foreground">
            Supprimer ce quiz ?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">
            Vous etes sur le point de supprimer{" "}
            <span className="font-medium text-card-foreground">
              {qcm.title}
            </span>.
            Cette action est irreversible et toutes les donnees associees seront perdues.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center">

          <AlertDialogCancel className="border-border">
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer definitivement
          </AlertDialogAction>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}