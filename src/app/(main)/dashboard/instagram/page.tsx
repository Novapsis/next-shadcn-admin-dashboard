"use client";

import { useState, useEffect } from "react";

import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { supabase } from "@/lib/supabase";

import { getColumns } from "./_components/columns"; // Corrected import
import { InstagramDetailModal } from "./_components/instagram-detail-modal";
import { type InstagramEntry } from "./types";

function InstagramPageClient() {
  const [data, setData] = useState<InstagramEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<InstagramEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInstagramEntries = async () => {
      const { data: entries, error } = await supabase
        .from("gestorias_instagram")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching Instagram entries:", error);
        toast.error("No se pudieron cargar las entradas de Instagram.");
        return;
      }
      setData(entries as InstagramEntry[]);
    };

    fetchInstagramEntries();

    const channel = supabase
      .channel("instagram-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "gestorias_instagram" }, (payload) => {
        console.log("Supabase Realtime Change Received (Instagram):", payload);
        fetchInstagramEntries(); // Refetch data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOpenModal = (entry: InstagramEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  // Pass handleOpenModal to the columns definition
  const tableColumns = getColumns({ onOpenModal: handleOpenModal }); // Call getColumns as a function
  const table = useDataTableInstance({ data, columns: tableColumns });

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Gestorías de Instagram</h1>
      <p className="text-muted-foreground mb-6">
        Aquí se listan las gestorías encontradas en Instagram mediante scraping.
      </p>
      <DataTable key={data.length} table={table} columns={tableColumns} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <span>
          Página{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </strong>
        </span>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </div>
      <InstagramDetailModal isOpen={isModalOpen} onClose={handleCloseModal} entryData={selectedEntry} />
    </div>
  );
}

export default InstagramPageClient;
