"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Send } from "lucide-react";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";

import { type EmailEntry, type FullEmailEntry } from "../types";

interface ColumnsProps {
  onOpenModal: (email: FullEmailEntry) => void;
  onApprove: (id: string) => void;
}

export const getColumns = ({ onOpenModal, onApprove }: ColumnsProps): ColumnDef<EmailEntry>[] => [
  {
    accessorKey: "nombre_empresa",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Empresa" />,
    cell: ({ row }) => <div className="w-[150px] truncate font-medium">{row.original.nombre_empresa}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "scraped_email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-[200px] truncate">{row.original.scraped_email}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "asunto_final",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Asunto" />,
    enableSorting: true,
  },
  {
    accessorKey: "estado_envio",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    enableSorting: true,
  },
  {
    accessorKey: "fecha_creacion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("fecha_creacion"));
      return <div className="w-[120px]">{date.toLocaleDateString()}</div>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const email = row.original as FullEmailEntry;

      const isPending = email.estado_envio === "pendiente";

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onOpenModal(email)} title="Revisar Email">
            <Eye className="h-4 w-4" />
          </Button>
          {isPending && (
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                onApprove(email.id);
                toast.success("Email marcado para envío.");
              }}
              title="Enviar Email"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
