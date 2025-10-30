"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";

import { type InstagramEntry } from "../types";

interface ColumnsProps {
  onOpenModal: (entry: InstagramEntry) => void;
}

export const getColumns = ({ onOpenModal }: ColumnsProps): ColumnDef<InstagramEntry>[] => [
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Usuario" />,
    cell: ({ row }) => (
      <a
        href={row.original.profile_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        @{row.original.username}
      </a>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre Completo" />,
    cell: ({ row }) => <div className="w-[150px] truncate">{row.original.full_name}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "followers_count",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Seguidores" />,
    enableSorting: true,
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <Button variant="outline" size="icon" onClick={() => onOpenModal(entry)} title="Ver Detalles">
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
