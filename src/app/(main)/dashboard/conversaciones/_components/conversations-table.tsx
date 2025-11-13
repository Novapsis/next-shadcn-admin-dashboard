"use client";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type Conversation } from "../types";

import { columns as createColumns } from "./columns";
import { ConversationHistoryModal } from "./conversation-history-modal";

interface ConversationsTableProps {
  data: Conversation[];
}

export function ConversationsTable({ data }: ConversationsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);

  const columns = React.useMemo<ColumnDef<Conversation>[]>(
    () => createColumns({ onShowHistory: setSelectedConversation }),
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar por cliente..."
          value={(table.getColumn("nombre")?.getFilterValue() as string | undefined) ?? ""}
          onChange={(event) => table.getColumn("nombre")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay conversaciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {selectedConversation && (
        <ConversationHistoryModal
          isOpen={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
          conversation={selectedConversation}
        />
      )}
    </div>
  );
}
