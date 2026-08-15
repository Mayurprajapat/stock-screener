'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Stock } from '@/app/mockData';
import { wsSimulator, WebSocketMessage } from '@/app/utils/websocket';

/**
 * Hook to manage WebSocket connection and price updates
 */
export function useWebSocket(symbols: string[]) {
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState<Map<string, { price: number; changePercent: number }>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const listenerRef = useRef<((msg: WebSocketMessage) => void) | null>(null);

  useEffect(() => {
    listenerRef.current = (message: WebSocketMessage) => {
      if (message.type === 'connection') {
        setIsConnected(message.status === 'connected');
        setError(null);
      } else if (message.type === 'price_update' && message.symbol && message.price !== undefined) {
        setPriceUpdates((prev) => {
          const updated = new Map(prev);
          updated.set(message.symbol!, {
            price: message.price!,
            changePercent: message.changePercent || 0,
          });
          return updated;
        });
      } else if (message.type === 'reconnecting') {
        setIsConnected(false);
      } else if (message.type === 'error') {
        setError(message.error || 'Connection error');
        setIsConnected(false);
      }
    };

    wsSimulator.on('price_update', listenerRef.current);
    wsSimulator.on('connection', listenerRef.current);
    wsSimulator.on('reconnecting', listenerRef.current);
    wsSimulator.on('error', listenerRef.current);

    // Connect
    wsSimulator.connect(symbols);

    return () => {
      if (listenerRef.current) {
        wsSimulator.off('price_update', listenerRef.current);
        wsSimulator.off('connection', listenerRef.current);
        wsSimulator.off('reconnecting', listenerRef.current);
        wsSimulator.off('error', listenerRef.current);
      }
      wsSimulator.disconnect();
    };
  }, [symbols]);

  const reconnect = useCallback(async () => {
    try {
      await wsSimulator.reconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reconnection failed');
    }
  }, []);

  return { isConnected, priceUpdates, error, reconnect };
}

/**
 * Hook for advanced stock filtering
 */
export function useFilterEngine(
  stocks: Stock[],
  filters: {
    search: string;
    sectors: string[];
    minMarketCap: number;
  }
) {
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>(stocks);
  const [filterTime, setFilterTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const result = stocks.filter((stock) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          stock.symbol.toLowerCase().includes(searchLower) || stock.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
        return false;
      }

      // Market cap filter
      if (stock.marketCap < filters.minMarketCap) {
        return false;
      }

      return true;
    });

    setFilteredStocks(result);
    setFilterTime(performance.now() - startTime);
  }, [stocks, filters]);

  return { filteredStocks, filterTime };
}

/**
 * Hook for real-time stock data with price updates from WebSocket
 */
export function useStockData(
  stocks: Stock[],
  priceUpdates: Map<string, { price: number; changePercent: number }>
) {
  const [stocksWithPriceUpdates, setStocksWithPriceUpdates] = useState<Stock[]>(stocks);

  useEffect(() => {
    if (priceUpdates.size === 0) {
      setStocksWithPriceUpdates(stocks);
      return;
    }

    const updated = stocks.map((stock) => {
      const update = priceUpdates.get(stock.symbol);
      if (update) {
        return {
          ...stock,
          price: stock.price + update.price, // Add delta
          changePercent: stock.changePercent + update.changePercent,
        };
      }
      return stock;
    });

    setStocksWithPriceUpdates(updated);
  }, [stocks, priceUpdates]);

  return stocksWithPriceUpdates;
}

/**
 * Hook for performance benchmarking
 */
export function usePerformanceBenchmark() {
  const benchmarks = useRef<Map<string, number[]>>(new Map());

  const mark = useCallback((name: string) => {
    performance.mark(name);
  }, []);

  const measure = useCallback(
    (name: string, startMark: string, endMark: string) => {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        if (entries.length > 0) {
          const duration = (entries[entries.length - 1] as PerformanceMeasure).duration;
          if (!benchmarks.current.has(name)) {
            benchmarks.current.set(name, []);
          }
          benchmarks.current.get(name)!.push(duration);
        }
      } catch (e) {
        console.error('Performance measurement error:', e);
      }
    },
    []
  );

  const getMetrics = useCallback(() => {
    const metrics: Record<string, { avg: number; max: number; min: number; count: number }> = {};

    benchmarks.current.forEach((times, name) => {
      if (times.length > 0) {
        metrics[name] = {
          avg: times.reduce((a, b) => a + b, 0) / times.length,
          max: Math.max(...times),
          min: Math.min(...times),
          count: times.length,
        };
      }
    });

    return metrics;
  }, []);

  return { mark, measure, getMetrics, benchmarks: benchmarks.current };
}
