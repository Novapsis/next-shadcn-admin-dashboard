"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Assuming a type for the email data
type Email = {
  asunto_final: string;
  cuerpo_html_final: string;
  scraped_email: string;
};

export function EmailDetailsModal({ email }: { email: Email }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ver Correo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{email.asunto_final}</DialogTitle>
          <DialogDescription>Enviado a: {email.scraped_email}</DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert bg-secondary max-w-none rounded-md border p-4">
          <p>{email.cuerpo_html_final}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
