"use client";

import { useState } from "react";

import { Power } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ComingSoonDialog } from "./coming-soon-dialog";

export function InstagramMessageAutomationButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="default"
        className="shadow-lg shadow-purple-500/50 transition-all duration-300"
      >
        <Power className="mr-2 h-4 w-4" />
        Automatización de Mensajes de Instagram
      </Button>
      <ComingSoonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Función Próximamente"
        description="Estamos trabajando en la automatización de mensajes de Instagram. ¡Pronto estará disponible!"
        imageSrc="/avatars/arhamkhnz.png" // Placeholder image
      />
    </>
  );
}
