"use client";

import { useState } from "react";
import DataGrid from "./DataGrid";
import { generateMockStocks } from "./mockData";

export default function Home() {
  const [allStocks] = useState(() => generateMockStocks(5000));
  const [search, setSearch] = useState("");

  const filteredStocks = allStocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: "20px" }}>
      <h1>Stock Screener ({filteredStocks.length} stocks)</h1>

      <input
        type="text"
        placeholder="Search symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "250px" }}
      />

      <DataGrid data={filteredStocks.slice(0, 100)} />
    </main>
  );
}