"use client";
"use no auto memoize";

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
import { formatPrice, formatMarketCap, formatVolume, formatPercentage, formatPE } from "./utils/formatting";

const columnHelper = createColumnHelper<Stock>();

const columns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    cell: (info) => <span className="font-bold text-blue-300">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Company Name",
    cell: (info) => <span className="text-slate-300">{info.getValue()}</span>,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => <span className="font-semibold text-green-400">{formatPrice(info.getValue())}</span>,
  }),
  columnHelper.accessor("changePercent", {
    header: "Change %",
    cell: (info) => {
      const value = info.getValue();
      return (
        <span className={`font-bold ${value >= 0 ? "text-green-400" : "text-red-400"}`}>
          {value >= 0 ? "▲" : "▼"} {formatPercentage(Math.abs(value))}
        </span>
      );
    },
  }),
  columnHelper.accessor("pe", {
    header: "P/E",
    cell: (info) => <span className="text-slate-300">{formatPE(info.getValue())}</span>,
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    cell: (info) => <span className="text-slate-300">{formatMarketCap(info.getValue())}</span>,
  }),
  columnHelper.accessor("volume", {
    header: "Volume",
    cell: (info) => <span className="text-slate-300">{formatVolume(info.getValue())}</span>,
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
    <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-slate-600/40 border-b border-slate-600 sticky top-0 z-20">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-bold text-slate-200 cursor-pointer hover:bg-slate-500/20 transition uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="text-slate-400">
                        {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() as string] ?? ""}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div ref={parentRef} className="h-96 overflow-auto">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          <table className="w-full border-collapse">
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedSymbol(row.original.symbol)}
                    className="hover:bg-blue-500/20 cursor-pointer transition border-b border-slate-600/30"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3 text-slate-200 text-sm">
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