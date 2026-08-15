"use client";

import { useState } from "react";
import DataGrid from "./DataGrid";
import { generateMockStocks } from "./mockData";
import { useStockStore } from "./store";

export default function Home() {
  const [allStocks] = useState(() => generateMockStocks(5000));

  const search = useStockStore((state) => state.search);
  const setSearch = useStockStore((state) => state.setSearch);
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);

  const filteredStocks = allStocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: "20px" }}>
      <h1>Stock Screener ({filteredStocks.length} stocks)</h1>

      {selectedSymbol && <p>Selected: {selectedSymbol}</p>}

      <input
        type="text"
        placeholder="Search symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "250px" }}
      />

      <DataGrid data={filteredStocks} />
    </main>
  );
}