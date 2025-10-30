"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

interface InstagramScrapingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchTerms = [
  "gestoría expatriados",
  "asesoría fiscal expatriados",
  "consultoría residencia fiscal",
  "fiscalidad internacional",
  "movilidad internacional expatriados",
  "no residentes declaración renta",
  "servicios migratorios fiscalidad",
];

export function InstagramScrapingDialog({ isOpen, onClose }: InstagramScrapingDialogProps) {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [manualTerm, setManualTerm] = useState("");
  const [searchType, setSearchType] = useState<"select" | "manual">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webhookUrl = "https://n8n.novapsis.site/webhook/instagram-leads-tax-solutions-manual";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const termToSearch = searchType === "manual" ? manualTerm : selectedTerm;

    if (!termToSearch) {
      toast.error("Por favor, selecciona o introduce un término de búsqueda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_term: termToSearch }),
      });

      if (response.ok) {
        toast.success(`Solicitud de scraping para "${termToSearch}" enviada correctamente.`);
        onClose();
      } else {
        toast.error("Error al enviar la solicitud de scraping. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error sending scraping request:", error);
      toast.error("Error de red. No se pudo contactar al servidor para la solicitud de scraping.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Instagram Scraping</DialogTitle>
          <DialogDescription>
            Selecciona o introduce un término para iniciar una búsqueda manual de leads en Instagram.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <RadioGroup
              value={searchType}
              onValueChange={(value) => setSearchType(value as "select" | "manual")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="select" />
                <Label htmlFor="select">Seleccionar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual">Manual</Label>
              </div>
            </RadioGroup>

            {searchType === "select" ? (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="searchTerm" className="text-right">
                  Término
                </Label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un término" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manualTerm" className="text-right">
                  Término
                </Label>
                <Input
                  id="manualTerm"
                  value={manualTerm}
                  onChange={(e) => setManualTerm(e.target.value)}
                  className="col-span-3"
                  placeholder="Introduce un término"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="mr-2" />}
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
