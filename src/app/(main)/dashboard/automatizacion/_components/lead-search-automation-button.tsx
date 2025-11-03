"use client";

import { useState, useEffect, useTransition } from "react";

import { Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getAutomationState, updateAutomationState } from "@/server/automation-actions";

export function LeadSearchAutomationButton() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();
  const webhookUrl = "https://n8n.novapsis.site/webhook/tax-solutions-busqueda-aut";
  const automationId = "lead_search";

  useEffect(() => {
    async function fetchInitialState() {
      const initialState = await getAutomationState(automationId);
      setIsActive(initialState);
    }
    fetchInitialState();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isActive) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 600);
    } else {
      clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive]);

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
        const newIsActive = !isActive;
        setIsActive(newIsActive);
        if (!newIsActive) {
          setProgress(0);
        }
        startTransition(() => {
          updateAutomationState(automationId, newIsActive);
        });
        toast.success(`Búsqueda automática ${newIsActive ? "activada" : "desactivada"} correctamente.`);
      } else {
        toast.error("Error al cambiar el estado de la búsqueda automática.");
      }
    } catch (error) {
      console.error("Error sending webhook:", error);
      toast.error("Error de red al contactar el webhook.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      <Button
        onClick={handleClick}
        variant={isActive ? "destructive" : "default"}
        className={`transition-all duration-300 ${isActive ? "shadow-lg shadow-red-500/50" : "shadow-lg shadow-green-500/50"}`}
        disabled={isPending}
      >
        {isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
        {isActive ? "Desactivar" : "Activar"} Búsqueda Automática
      </Button>
      {isActive && (
        <div className="relative pt-1">
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}
