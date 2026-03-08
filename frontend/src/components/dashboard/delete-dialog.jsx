"use client"

import React from "react"
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from "../ui_dashboard/alert-dialog"
import { AlertTriangle } from "lucide-react"

export function DeleteDialog({ qcm, open, onOpenChange, onConfirm }) {
  // Si aucun QCM n'est sélectionné, on n'affiche rien
  if (!qcm) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-gray-200 bg-white">
        <AlertDialogHeader>
          {/* Icône d'avertissement visuelle */}
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <AlertDialogTitle className="text-center font-bold text-gray-900">
            Supprimer ce quiz ?
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center text-gray-500">
            Vous êtes sur le point de supprimer{" "}
            <span className="font-semibold text-gray-900">{qcm.title}</span>.
            <br />
            Cette action est irréversible et toutes les données associées seront perdues.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-50">
            Annuler
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 border-none"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}