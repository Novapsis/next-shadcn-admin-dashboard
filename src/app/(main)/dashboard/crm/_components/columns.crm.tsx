import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/supabase";

import { LeadDetailsModal } from "./lead-details-modal"; // Import the new modal

const channelColorMap: { [key: string]: string } = {
  Whatsapp: "oklch(0.65 0.2 145)",
  Instagram: "oklch(0.7 0.22 320)",
  Linkedin: "oklch(0.5 0.15 260)",
  Facebook: "oklch(0.67 0.14 205)",
  X: "oklch(0.73 0.2 50)",
};
const defaultColor = "oklch(0.7 0.1 200)"; // A default muted blue

export const recentLeadsColumns: ColumnDef<Lead>[] = [
  {
    id: "view",
    header: () => null, // Add empty header
    cell: ({ row }) => <LeadDetailsModal lead={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre_empresa",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Empresa" />,
    cell: ({ row }) => <div className="w-[200px] truncate font-medium">{row.original.nombre_empresa}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-[200px] truncate">{row.original.email}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;

      if (!status) {
        return <Badge style={{ backgroundColor: defaultColor, color: "white", border: "none" }}>Sin estado</Badge>;
      }

      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      // eslint-disable-next-line security/detect-object-injection
      const color = channelColorMap[formattedStatus] ?? defaultColor;
      return <Badge style={{ backgroundColor: color, color: "white", border: "none" }}>{status}</Badge>;
    },
  },
  {
    accessorKey: "pais",
    header: ({ column }) => <DataTableColumnHeader column={column} title="País" />,
    cell: ({ row }) => <span>{row.original.pais}</span>,
  },
  {
    accessorKey: "timestamp_registro",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Registrado" />,
    cell: ({ row }) => {
      const date = new Date(row.original.timestamp_registro);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return <span className="text-muted-foreground tabular-nums">{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
        <EllipsisVertical />
        <span className="sr-only">Open menu</span>
      </Button>
    ),
    enableSorting: false,
  },
];
