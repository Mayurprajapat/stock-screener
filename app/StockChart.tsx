"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, IChartApi, LineSeries } from "lightweight-charts";
import { generateOHLCV } from "./ohlcvGenerator";
import { calculateAllIndicators } from "./utils/indicators";

export default function StockChart({ symbol, price }: { symbol: string; price: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [showIndicators, setShowIndicators] = useState({
    sma20: true,
    sma50: true,
    ema12: false,
    bollingerBands: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Chart banao
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#cbd5e1",
      },
      timeScale: {
        timeVisible: true,
      },
    });
    chartRef.current = chart;

    // Candlestick series add karo
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // Data generate karo
    const ohlcvData = generateOHLCV(price);
    candleSeries.setData(ohlcvData);

    // Calculate indicators
    const indicators = calculateAllIndicators(ohlcvData);

    // SMA 20
    if (showIndicators.sma20) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: "#3b82f6",
        lineWidth: 2,
      });
      const smaData = ohlcvData
        .map((d, i) => ({
          time: d.time,
          value: indicators[i].sma20,
        }))
        .filter((d) => d.value !== null);
      smaSeries.setData(smaData);
    }

    // SMA 50
    if (showIndicators.sma50) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 2,
      });
      const smaData = ohlcvData
        .map((d, i) => ({
          time: d.time,
          value: indicators[i].sma50,
        }))
        .filter((d) => d.value !== null);
      smaSeries.setData(smaData);
    }

    // EMA 12
    if (showIndicators.ema12) {
      const emaSeries = chart.addSeries(LineSeries, {
        color: "#ec4899",
        lineWidth: 1,
        lineStyle: 2,
      });
      const emaData = ohlcvData
        .map((d, i) => ({
          time: d.time,
          value: indicators[i].ema12,
        }))
        .filter((d) => d.value !== null);
      emaSeries.setData(emaData);
    }

    chart.timeScale().fitContent();

    // Resize handler
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol, price, showIndicators]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-green-400">📊</span> {symbol} — Advanced Chart
        </h2>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowIndicators((p) => ({ ...p, sma20: !p.sma20 }))}
            className={`px-3 py-1 rounded text-sm transition ${
              showIndicators.sma20
                ? "bg-blue-600 text-white"
                : "bg-slate-600/40 text-slate-300 hover:bg-slate-600/60"
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowIndicators((p) => ({ ...p, sma50: !p.sma50 }))}
            className={`px-3 py-1 rounded text-sm transition ${
              showIndicators.sma50
                ? "bg-amber-600 text-white"
                : "bg-slate-600/40 text-slate-300 hover:bg-slate-600/60"
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowIndicators((p) => ({ ...p, ema12: !p.ema12 }))}
            className={`px-3 py-1 rounded text-sm transition ${
              showIndicators.ema12
                ? "bg-pink-600 text-white"
                : "bg-slate-600/40 text-slate-300 hover:bg-slate-600/60"
            }`}
          >
            EMA 12
          </button>
        </div>
      </div>
      <p className="text-slate-400 text-sm">
        📈 Indicators: SMA 20 (Blue), SMA 50 (Orange), EMA 12 (Pink), RSI, Bollinger Bands, MACD, Stochastic
        (available in data layer)
      </p>
      <div ref={containerRef} className="rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/50" />
    </div>
  );
}