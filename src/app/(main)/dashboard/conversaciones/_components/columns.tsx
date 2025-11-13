"use client";

import Link from "next/link";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { type Conversation } from "../types";

export const columns = (): ColumnDef<Conversation>[] => [
  {
    accessorKey: "nombre",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
  },
  {
    accessorKey: "platform_source",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fuente" />,
    cell: ({ row }) => {
      const { platform_source, nicho_busqueda, ubicacion_busqueda } = row.original;

      if (!platform_source) {
        return <Badge className="border-green-600 bg-green-50 text-green-700">Orgánico</Badge>;
      }

      return (
        <div className="flex flex-row flex-wrap gap-1">
          <Badge variant="secondary" className="flex-wrap">
            <span className="mr-1 font-semibold">Fuente:</span>
            {platform_source}
          </Badge>
          <Badge variant="secondary" className="flex-wrap">
            <span className="mr-1 font-semibold">Nicho:</span>
            {nicho_busqueda}
          </Badge>
          <Badge variant="secondary" className="flex-wrap">
            <span className="mr-1 font-semibold">Ubicación:</span>
            {ubicacion_busqueda}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conversation = row.original;

      return (
        <div className="text-right">
          <Button asChild>
            <Link href={`/dashboard/conversaciones/${conversation.id}`}>Ver Historial</Link>
          </Button>
        </div>
      );
    },
  },
];
