"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lead } from "@/types/supabase";

interface LeadDetailsModalProps {
  lead: Lead;
}

export function LeadDetailsModal({ lead }: LeadDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </DialogTrigger>
      {/* Remove padding from parent, apply styles to a new inner div */}
      <DialogContent className="p-0 sm:max-w-lg">
        <div className="rounded-lg bg-[oklch(0.15_0.04_260)] p-6 text-[oklch(0.95_0.01_90)] dark:bg-[oklch(0.99_0.005_90)] dark:text-[oklch(0.2_0.05_260)]">
          <DialogHeader>
            <DialogTitle>Detalles del Lead</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-base">
            {" "}
            {/* Larger base text */}
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Empresa</span>
              <span className="col-span-2 font-bold">{lead.nombre_empresa ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Email</span>
              <span className="col-span-2 font-bold">{lead.email ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">País</span>
              <span className="col-span-2 font-bold">{lead.pais ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Estado</span>
              <span className="col-span-2 font-bold">{lead.status ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Registrado</span>
              <span className="col-span-2 font-bold">{new Date(lead.timestamp_registro).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Teléfono</span>
              <span className="col-span-2 font-bold">{lead.formatted_phone_number ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Website</span>
              <span className="col-span-2 font-bold">{lead.website_inicial ?? "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Rating Google</span>
              <span className="col-span-2 font-bold">{lead.rating_google ?? "N/A"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
