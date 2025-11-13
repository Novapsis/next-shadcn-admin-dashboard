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
import { countries, citiesByCountry } from "@/data/locations";

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
                    <CommandList className="[box-shadow:inset_0_10px_8px_-8px_hsl(var(--muted)),_inset_0_-10px_8px_-8px_hsl(var(--muted))]">
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
                            className="data-[selected=true]:text-primary-foreground data-[selected=true]:bg-primary"
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
