// mockData.ts
export interface Stock {
  symbol: string;
  price: number;
  changePercent: number;
  sector: string;
  marketCap: number; // Crore me
  pe: number;
}

const SECTORS = ["IT", "Banking", "Pharma", "FMCG", "Auto", "Energy"];

export function generateMockStocks(count: number): Stock[] {
  const stocks: Stock[] = [];

  for (let i = 0; i < count; i++) {
    stocks.push({
      symbol: `STOCK${i}`,
      price: Math.round(Math.random() * 5000 * 100) / 100,
      changePercent: Math.round((Math.random() * 10 - 5) * 100) / 100,
      sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
      marketCap: Math.round(Math.random() * 500000),
      pe: Math.round(Math.random() * 80 * 10) / 10,
    });
  }

  return stocks;
}