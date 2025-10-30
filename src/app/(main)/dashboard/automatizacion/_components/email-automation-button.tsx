"use client";

import { useState, useEffect, useCallback } from "react";

import { Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function EmailAutomationButton() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const webhookUrl = "https://n8n.novapsis.site/webhook/tax-activate";

  const fetchStatus = useCallback(async () => {
    // In a real scenario, you might fetch the current status from your backend
    // For this demo, we'll assume it starts inactive.
    // Or, you could ping the webhook to see its status if it supports it.
    // For now, we'll just rely on the local state.
  }, []);

  useEffect(() => {
    fetchStatus();

    let timer: NodeJS.Timeout | undefined;
    if (isActive) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 20)); // Cycle the progress
      }, 800);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0); // Reset on deactivation
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isActive, fetchStatus]);

  const handleClick = async () => {
    console.log("Button clicked!");
    console.log("Current isActive state:", isActive);
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
        toast.success(`Automatización ${isActive ? "desactivada" : "activada"} correctamente.`);
      } else {
        toast.error("Error al cambiar el estado de la automatización.");
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
        className={`w-full transition-all duration-300 ${isActive ? "shadow-lg shadow-red-500/50" : "shadow-lg shadow-green-500/50"}`}
      >
        {isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
        {isActive ? "Desactivar" : "Activar"} Automatización
      </Button>
      {isActive && (
        <div className="relative pt-1">
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}
