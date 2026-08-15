"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, IChartApi } from "lightweight-charts";
import { generateOHLCV } from "./ohlcvGenerator";

export default function StockChart({ symbol, price }: { symbol: string; price: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Chart banao
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
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

    // Data generate karo aur chart me daalo
    const data = generateOHLCV(price);
    candleSeries.setData(data);

    chart.timeScale().fitContent();

    // Cleanup — jab component hat jaye screen se, chart bhi remove kar do
    return () => {
      chart.remove();
    };
  }, [symbol, price]); // jab bhi symbol badle, chart naye data se banega

  return (
    <div>
      <h3>{symbol} — Chart</h3>
      <div ref={containerRef} />
    </div>
  );
}