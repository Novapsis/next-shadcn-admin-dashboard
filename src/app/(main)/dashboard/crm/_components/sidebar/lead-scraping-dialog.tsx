"use client";

import { useState } from "react";

import { PlusCircleIcon, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

const citiesByCountry: Record<string, { value: string; label: string }[]> = {
  es: [
    { value: "madrid", label: "Madrid" },
    { value: "barcelona", label: "Barcelona" },
    { value: "valencia", label: "Valencia" },
    { value: "sevilla", label: "Sevilla" },
    { value: "zaragoza", label: "Zaragoza" },
  ],
  pt: [
    { value: "lisbon", label: "Lisboa" },
    { value: "porto", label: "Oporto" },
    { value: "coimbra", label: "Coimbra" },
    { value: "braga", label: "Braga" },
    { value: "faro", label: "Faro" },
  ],
  ad: [
    { value: "andorra la vella", label: "Andorra la Vella" },
    { value: "escaldes-engordany", label: "Escaldes-Engordany" },
    { value: "encamp", label: "Encamp" },
    { value: "sant julia de loria", label: "Sant Julià de Lòria" },
    { value: "la massana", label: "La Massana" },
  ],
  fr: [
    { value: "paris", label: "Paris" },
    { value: "marseille", label: "Marsella" },
    { value: "lyon", label: "Lyon" },
    { value: "toulouse", label: "Toulouse" },
    { value: "nice", label: "Niza" },
  ],
  it: [
    { value: "rome", label: "Roma" },
    { value: "milan", label: "Milán" },
    { value: "naples", label: "Nápoles" },
    { value: "turin", label: "Turín" },
    { value: "palermo", label: "Palermo" },
  ],
  us: [
    { value: "new york", label: "New York" },
    { value: "los angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "houston", label: "Houston" },
    { value: "phoenix", label: "Phoenix" },
  ],
  ca: [
    { value: "toronto", label: "Toronto" },
    { value: "montreal", label: "Montreal" },
    { value: "vancouver", label: "Vancouver" },
    { value: "calgary", label: "Calgary" },
    { value: "ottawa", label: "Ottawa" },
  ],
  mx: [
    { value: "mexico city", label: "Ciudad de México" },
    { value: "tijuana", label: "Tijuana" },
    { value: "ecatepec", label: "Ecatepec" },
    { value: "leon", label: "León" },
    { value: "puebla", label: "Puebla" },
  ],
  ar: [
    { value: "buenos aires", label: "Buenos Aires" },
    { value: "cordoba", label: "Córdoba" },
    { value: "rosario", label: "Rosario" },
    { value: "mendoza", label: "Mendoza" },
    { value: "la plata", label: "La Plata" },
  ],
  br: [
    { value: "sao paulo", label: "São Paulo" },
    { value: "rio de janeiro", label: "Rio de Janeiro" },
    { value: "salvador", label: "Salvador" },
    { value: "brasilia", label: "Brasília" },
    { value: "fortaleza", label: "Fortaleza" },
  ],
  co: [
    { value: "bogota", label: "Bogotá" },
    { value: "medellin", label: "Medellín" },
    { value: "cali", label: "Cali" },
    { value: "barranquilla", label: "Barranquilla" },
    { value: "cartagena", label: "Cartagena" },
  ],
  cl: [
    { value: "santiago", label: "Santiago" },
    { value: "valparaiso", label: "Valparaíso" },
    { value: "concepcion", label: "Concepción" },
    { value: "la serena", label: "La Serena" },
    { value: "antofagasta", label: "Antofagasta" },
  ],
  pe: [
    { value: "lima", label: "Lima" },
    { value: "arequipa", label: "Arequipa" },
    { value: "trujillo", label: "Trujillo" },
    { value: "chiclayo", label: "Chiclayo" },
    { value: "piura", label: "Piura" },
  ],
};

export function LeadScrapingDialog() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!country || !city || !searchTerm) {
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
          ciudad: city,
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

  const currentCities = citiesByCountry[country] || [];

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
              <Select
                onValueChange={(value) => {
                  setCountry(value);
                  setCity("");
                }}
                value={country}
              >
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
              <Label htmlFor="city" className="text-right">
                Ciudad
              </Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="col-span-3 justify-between font-normal"
                    disabled={!country}
                  >
                    {city
                      ? (currentCities.find((c) => c.value === city)?.label ?? city)
                      : "Selecciona o escribe una ciudad"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Buscar ciudad..." onValueChange={setCity} />
                    <CommandList>
                      <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                      <CommandGroup>
                        {currentCities.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(currentValue) => {
                              setCity(currentValue === city ? "" : currentValue);
                              setPopoverOpen(false);
                            }}
                          >
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
