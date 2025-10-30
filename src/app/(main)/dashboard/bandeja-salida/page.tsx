"use client";

import { useState, useEffect, useTransition, useCallback } from "react";

import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { supabase } from "@/lib/supabase";

import { approveEmail } from "./_components/actions";
import { getColumns } from "./_components/columns";
import { EmailReviewModal } from "./_components/email-review-modal";
import { type EmailEntry, type FullEmailEntry } from "./types";

function BandejaDeSalidaClient() {
  const [data, setData] = useState<EmailEntry[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<FullEmailEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, startTransition] = useTransition(); // isPending is not used
  const [showPendingOnly, setShowPendingOnly] = useState(true); // New state for filter

  const fetchEmails = useCallback(async () => {
    let query = supabase.from("envios_email").select("*").order("fecha_creacion", { ascending: false });

    if (showPendingOnly) {
      query = query.eq("estado_envio", "pendiente");
    }

    const { data: emails, error } = await query;

    console.log("Supabase fetch result - Data:", emails);
    console.log("Supabase fetch result - Error:", error);

    if (error) {
      console.error("Error fetching emails:", error);
      toast.error("No se pudieron cargar los emails.");
      return;
    }
    setData(emails as EmailEntry[]);
  }, [showPendingOnly]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmails();

    // Set up a Supabase subscription to listen for changes
    const channel = supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "envios_email" }, (payload) => {
        console.log("Supabase Realtime Change Received:", payload);
        fetchEmails(); // Refetch data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEmails]); // Re-fetch when fetchEmails changes (due to showPendingOnly)

  const handleOpenModal = (email: FullEmailEntry) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveEmail(id);
      if (result.success) {
        toast.success(result.message);
        handleCloseModal();
        // Explicitly refetch data after successful approval for immediate UI update
        fetchEmails();
      } else {
        toast.error(result.message);
      }
    });
  };

  const columns = getColumns({ onOpenModal: handleOpenModal, onApprove: handleApprove });
  const table = useDataTableInstance({ data, columns });

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Bandeja de Salida</h1>
      <p className="text-muted-foreground mb-6">
        Aquí se listan los emails. Puedes filtrar por los pendientes de aprobación.
      </p>
      <div className="mb-4">
        <Button onClick={() => setShowPendingOnly(!showPendingOnly)} variant={showPendingOnly ? "default" : "outline"}>
          {showPendingOnly ? "Mostrar Todos los Emails" : "Mostrar Solo Pendientes"}
        </Button>
      </div>
      <DataTable key={data.length} table={table} columns={columns} />
      <EmailReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        emailData={selectedEmail}
        onApprove={handleApprove}
      />
    </div>
  );
}

export default BandejaDeSalidaClient;
