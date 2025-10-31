"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteDialog({ onConfirm, triggerLabel = "Eliminar" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-red-600 hover:underline">{triggerLabel}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción eliminará el registro permanentemente.
            No podrás deshacerla.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}