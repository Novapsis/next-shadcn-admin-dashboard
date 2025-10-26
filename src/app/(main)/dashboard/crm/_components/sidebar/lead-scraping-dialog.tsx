"use client";

import { useState } from "react";

import { PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarMenuButton } from "@/components/ui/sidebar";

const countries = [
  // Europe
  { value: "es", label: "España" },
  { value: "pt", label: "Portugal" },
  { value: "ad", label: "Andorra" },
  { value: "fr", label: "Francia" },
  { value: "it", label: "Italia" },
  // North America
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  // South America
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brazil" },
  { value: "co", label: "Colombia" },
  { value: "cl", label: "Chile" },
  { value: "pe", label: "Peru" },
];

export function LeadScrapingDialog() {
  const [country, setCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!country || !searchTerm) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    const webhookUrl = "https://n8n.novapsis.site/webhook/taxsolutions";

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pais: country,
          objeto_busqueda: searchTerm,
        }),
      });

      if (response.ok) {
        toast.success("Búsqueda de leads iniciada correctamente.");
        setIsOpen(false); // Close the dialog on success
      } else {
        toast.error("Error al iniciar la búsqueda. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error de red. No se pudo contactar al servidor.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          tooltip="Buscar Leads"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        >
          <PlusCircleIcon />
          <span>Buscar Leads</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Búsqueda de Leads Automatizada</DialogTitle>
            <DialogDescription>
              Introduce los criterios para iniciar una nueva búsqueda de leads mediante scraping.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                País
              </Label>
              <Select onValueChange={setCountry} value={country}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search-term" className="text-right">
                Búsqueda
              </Label>
              <Input
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="col-span-3"
                placeholder="Ej: agencias de marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Iniciar Búsqueda</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
