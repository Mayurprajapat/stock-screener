"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useState, useRef } from "react";
import { Stock } from "./mockData";
import { useStockStore } from "./store";

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
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  // scroll hone waala container
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,        // total kitni rows hain
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,    // har row ki height (pixels me)
    overscan: 10,               // upar/neeche 10 extra rows render karo buffer ke liye
  });

  return (
    <div>
      {/* Header alag se, fixed rakhne ke liye */}
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
      </table>

      {/* Scrollable container — sirf yahan virtual scrolling hoti hai */}
      <div ref={parentRef} style={{ height: "500px", overflow: "auto" }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedSymbol(row.original.symbol)}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}