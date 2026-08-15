"use client";

import { useState } from "react";
import DataGrid from "./DataGrid";
import FilterPanel from "./FilterPanel";
import { generateMockStocks } from "./mockData";
import { useStockStore } from "./store";

export default function Home() {
  const [allStocks] = useState(() => generateMockStocks(5000));

  const search = useStockStore((state) => state.search);
  const setSearch = useStockStore((state) => state.setSearch);
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);
  const selectedSectors = useStockStore((state) => state.selectedSectors);
  const minMarketCap = useStockStore((state) => state.minMarketCap);

  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesSector =
      selectedSectors.length === 0 || selectedSectors.includes(stock.sector);
    const matchesMarketCap = stock.marketCap >= minMarketCap;

    return matchesSearch && matchesSector && matchesMarketCap;
  });

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

      <div style={{ display: "flex", gap: "16px" }}>
        <FilterPanel />
        <div style={{ flex: 1 }}>
          <DataGrid data={filteredStocks} />
        </div>
      </div>
    </main>
  );
}