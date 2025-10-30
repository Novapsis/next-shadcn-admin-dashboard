"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { type InstagramEntry } from "../types";

interface InstagramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryData: InstagramEntry | null;
}

export function InstagramDetailModal({ isOpen, onClose, entryData }: InstagramDetailModalProps) {
  if (!entryData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detalles de Gestoría de Instagram</DialogTitle>
          <DialogDescription>
            Información completa de la entrada de Instagram para @{entryData.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Término de Búsqueda:</p>
            <p className="col-span-2">{entryData.search_term}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Usuario:</p>
            <a
              href={entryData.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center gap-1 text-blue-500 hover:underline"
            >
              @{entryData.username} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Nombre Completo:</p>
            <p className="col-span-2">{entryData.full_name}</p>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <p className="text-right font-semibold">Biografía:</p>
            <p className="col-span-2 whitespace-pre-wrap">{entryData.biography}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Seguidores:</p>
            <p className="col-span-2">{entryData.followers_count.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Score:</p>
            <p className="col-span-2">{entryData.score}</p>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <p className="text-right font-semibold">Razón:</p>
            <p className="col-span-2 whitespace-pre-wrap">{entryData.reason}</p>
          </div>
          <div className="grid grid-cols-3 items-start gap-4">
            <p className="text-right font-semibold">URLs Externas:</p>
            <div className="col-span-2 flex flex-col gap-1">
              {Array.isArray(entryData.external_urls) && entryData.external_urls.length > 0
                ? entryData.external_urls.map((link, index) =>
                    link.url && typeof link.url === "string" ? (
                      <a
                        key={link.url} // Use link.url as a key
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {new URL(link.url).hostname}
                      </a>
                    ) : (
                      <span key={`invalid-link-${index}`} className="text-muted-foreground">
                        N/A (URL inválida)
                      </span> // Fallback key
                    ),
                  )
                : "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <p className="text-right font-semibold">Fecha de Creación:</p>
            <p className="col-span-2">{new Date(entryData.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
