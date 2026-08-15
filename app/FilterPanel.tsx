"use client";

import { useStockStore } from "./store";

const SECTORS = ["IT", "Banking", "Pharma", "FMCG", "Auto", "Energy"];

export default function FilterPanel() {
  const selectedSectors = useStockStore((state) => state.selectedSectors);
  const toggleSector = useStockStore((state) => state.toggleSector);
  const minMarketCap = useStockStore((state) => state.minMarketCap);
  const setMinMarketCap = useStockStore((state) => state.setMinMarketCap);

  return (
    <div className="w-64 bg-slate-700/30 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm h-fit sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-blue-400">⚙️</span> Filters
      </h3>

      {/* Sector Filter */}
      <div className="mb-8">
        <label className="text-white font-semibold text-sm mb-3 block">📊 Sector</label>
        <div className="space-y-2">
          {SECTORS.map((sector) => (
            <label key={sector} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSectors.includes(sector)}
                onChange={() => toggleSector(sector)}
                className="w-4 h-4 rounded border-slate-500 bg-slate-600 text-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-slate-300 group-hover:text-white transition text-sm">
                {sector}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Market Cap Filter */}
      <div className="pt-6 border-t border-slate-600/50">
        <div className="flex justify-between items-center mb-3">
          <label className="text-white font-semibold text-sm flex items-center gap-2">
            <span>💰</span> Market Cap
          </label>
          <span className="text-blue-400 font-bold text-sm">₹{(minMarketCap / 1000).toFixed(0)}K Cr</span>
        </div>
        <input
          type="range"
          min={0}
          max={500000}
          step={1000}
          value={minMarketCap}
          onChange={(e) => setMinMarketCap(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>₹0</span>
          <span>₹500K Cr</span>
        </div>
      </div>
    </div>
  );
}