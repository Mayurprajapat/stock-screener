// mockData.ts
export interface Stock {
  symbol: string;
  price: number;
  changePercent: number;
}

export function generateMockStocks(count: number): Stock[] {
  const stocks: Stock[] = [];

  for (let i = 0; i < count; i++) {
    stocks.push({
      symbol: `STOCK${i}`,
      price: Math.round(Math.random() * 5000 * 100) / 100,
      changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
    });
  }

  return stocks;
}