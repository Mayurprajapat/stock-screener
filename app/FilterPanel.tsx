"use client";

import { useStockStore } from "./store";

const SECTORS = ["IT", "Banking", "Pharma", "FMCG", "Auto", "Energy"];

export default function FilterPanel() {
  const selectedSectors = useStockStore((state) => state.selectedSectors);
  const toggleSector = useStockStore((state) => state.toggleSector);
  const minMarketCap = useStockStore((state) => state.minMarketCap);
  const setMinMarketCap = useStockStore((state) => state.setMinMarketCap);

  return (
    <div style={{ width: "220px", padding: "12px", border: "1px solid #ddd" }}>
      <h3>Filters</h3>

      <div style={{ marginBottom: "16px" }}>
        <label>Sector</label>
        {SECTORS.map((sector) => (
          <div key={sector}>
            <label>
              <input
                type="checkbox"
                checked={selectedSectors.includes(sector)}
                onChange={() => toggleSector(sector)}
              />
              {" "}{sector}
            </label>
          </div>
        ))}
      </div>

      <div>
        <label>Min Market Cap (Cr): {minMarketCap}</label>
        <input
          type="range"
          min={0}
          max={500000}
          step={1000}
          value={minMarketCap}
          onChange={(e) => setMinMarketCap(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}