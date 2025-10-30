"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// We'll get the real type later
interface EmailData {
  id: string;
  nombre_empresa: string;
  scraped_email: string;
  asunto_final: string;
  cuerpo_html_final: string;
}

interface EmailReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: EmailData | null;
  onApprove: (id: string) => void;
}

export function EmailReviewModal({ isOpen, onClose, emailData, onApprove }: EmailReviewModalProps) {
  if (!emailData) return null;

  const handleApprove = () => {
    onApprove(emailData.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Revisar Email</DialogTitle>
          <DialogDescription>
            Verifica el contenido del email antes de aprobar su envío a <strong>{emailData.nombre_empresa}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-right font-semibold">Destinatario:</p>
            <p className="col-span-3">{emailData.scraped_email}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-right font-semibold">Asunto:</p>
            <p className="col-span-3">{emailData.asunto_final}</p>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-center font-semibold">Cuerpo del Mensaje:</p>
            <div
              className="prose dark:prose-invert max-h-[400px] overflow-y-auto rounded-md border p-4"
              dangerouslySetInnerHTML={{ __html: emailData.cuerpo_html_final }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApprove}>Aprobar y Enviar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
