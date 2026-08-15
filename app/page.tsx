"use client";

import { useState, useEffect } from "react";
import DataGrid from "./DataGrid";
import FilterPanel from "./FilterPanel";
import StockChart from "./StockChart";
import { generateMockStocks, Stock } from "./mockData";
import { useStockStore } from "./store";
import { useWebSocket, useFilterEngine, useStockData } from "./hooks/useCustomHooks";

export default function Home() {
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Generate mock data only on client side to prevent hydration mismatch
  useEffect(() => {
    setAllStocks(generateMockStocks(5000));
    setIsClient(true);
  }, []);

  const search = useStockStore((state) => state.search);
  const setSearch = useStockStore((state) => state.setSearch);
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);
  const selectedSectors = useStockStore((state) => state.selectedSectors);
  const minMarketCap = useStockStore((state) => state.minMarketCap);

  // WebSocket integration for real-time price updates
  const { isConnected, priceUpdates, error: wsError, reconnect } = useWebSocket(
    allStocks.map((s) => s.symbol)
  );

  // Apply price updates to stocks
  const stocksWithPriceUpdates = useStockData(allStocks, priceUpdates);

  // Use filter engine with performance benchmarking
  const { filteredStocks, filterTime } = useFilterEngine(stocksWithPriceUpdates, {
    search,
    sectors: selectedSectors,
    minMarketCap,
  });

  const selectedStock = stocksWithPriceUpdates.find((s) => s.symbol === selectedSymbol);

  // Calculate market stats
  const gainers = stocksWithPriceUpdates.filter((s) => s.changePercent > 0).length;
  const losers = stocksWithPriceUpdates.filter((s) => s.changePercent < 0).length;
  const avgChange =
    stocksWithPriceUpdates.length > 0
      ? (
          stocksWithPriceUpdates.reduce((sum, s) => sum + s.changePercent, 0) /
          stocksWithPriceUpdates.length
        ).toFixed(2)
      : "0";
  const totalMarketCap = stocksWithPriceUpdates.reduce((sum, s) => sum + s.marketCap, 0);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" suppressHydrationWarning>
      {/* Header */}
      <div className="bg-black/40 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📈 Stock Screener</h1>
              <p className="text-slate-400 text-sm">
                Track {isClient ? allStocks.length : 0} stocks • Filtered: {isClient ? filteredStocks.length : 0} results •{" "}
                {filterTime > 0 && <span className="text-blue-400">Filter time: {filterTime.toFixed(2)}ms</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isConnected
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
                {isConnected ? "Live Updates 🔄" : "Disconnected"}
              </div>
              {wsError && (
                <button
                  onClick={reconnect}
                  className="px-3 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg text-sm hover:bg-orange-500/30 transition"
                >
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isClient ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-300">Loading stocks...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-sm mb-1">Gainers</p>
                <p className="text-2xl font-bold text-green-400">{gainers}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stocksWithPriceUpdates.length > 0 ? ((gainers / stocksWithPriceUpdates.length) * 100).toFixed(1) : "0"}%
                </p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-sm mb-1">Losers</p>
                <p className="text-2xl font-bold text-red-400">{losers}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stocksWithPriceUpdates.length > 0 ? ((losers / stocksWithPriceUpdates.length) * 100).toFixed(1) : "0"}%
                </p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-sm mb-1">Avg Change</p>
                <p
                  className={`text-2xl font-bold ${
                    parseFloat(avgChange) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {parseFloat(avgChange) >= 0 ? "+" : ""}
                  {avgChange}%
                </p>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-slate-400 text-sm mb-1">Total Market Cap</p>
                <p className="text-2xl font-bold text-blue-400">₹{(totalMarketCap / 100000).toFixed(0)}L Cr</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Search stock symbol or company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Main Content */}
            <div className="flex gap-8">
              <FilterPanel />
              <div className="flex-1">
                <DataGrid data={filteredStocks} />
              </div>
            </div>

            {/* Chart Section */}
            {selectedStock && (
              <div className="mt-12 bg-slate-700/30 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm">
                <StockChart symbol={selectedStock.symbol} price={selectedStock.price} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}