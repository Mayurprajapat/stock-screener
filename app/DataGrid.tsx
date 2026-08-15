"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Stock } from "./mockData";

const columnHelper = createColumnHelper<Stock>();

const columns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `₹${info.getValue()}`,
  }),
  columnHelper.accessor("changePercent", {
    header: "Change %",
    cell: (info) => {
      const value = info.getValue();
      return (
        <span style={{ color: value >= 0 ? "green" : "red" }}>
          {value >= 0 ? "▲" : "▼"} {value}%
        </span>
      );
    },
  }),
];

export default function DataGrid({ data }: { data: Stock[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ?? ""}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ border: "1px solid #ddd", padding: "8px" }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}