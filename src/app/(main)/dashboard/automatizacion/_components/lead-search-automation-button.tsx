"use client";

import { useState } from "react";

import { Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LeadSearchAutomationButton() {
  const [isActive, setIsActive] = useState(false);
  const webhookUrl = "https://n8n.novapsis.site/webhook/tax-solutions-busqueda-aut";

  const handleClick = async () => {
    const message = isActive ? "stop" : "start";
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setIsActive(!isActive);
        toast.success(`Búsqueda automática ${isActive ? "desactivada" : "activada"} correctamente.`);
      } else {
        toast.error("Error al cambiar el estado de la búsqueda automática.");
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
      toast.error("Error de red al contactar el webhook.");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isActive ? "destructive" : "default"}
      className={`transition-all duration-300 ${isActive ? "shadow-lg shadow-red-500/50" : "shadow-lg shadow-green-500/50"}`}
    >
      {isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
      {isActive ? "Desactivar" : "Activar"} Búsqueda Automática
    </Button>
  );
}
