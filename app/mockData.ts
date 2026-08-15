// mockData.ts
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
  marketCap: number; // Crore me
  pe: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

const STOCK_NAMES: { [key: string]: string[] } = {
  IT: ["TCS", "Infosys", "Wipro", "HCL Tech", "Tech Mahindra", "Mphasis", "LTI Mindtree", "Persistent", "Coforge", "Zensar"],
  Banking: ["HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "SBI", "IndusInd Bank", "Federal Bank", "YES Bank", "IDBI", "BoB"],
  Pharma: ["Sun Pharma", "Cipla", "Dr Reddy's", "Lupin", "Aurobindo", "Cadila", "Glenmark", "Biocon", "Natco", "Torrent"],
  FMCG: ["ITC", "HUL", "Britannia", "Nestlé", "Marico", "Godrej", "P&G", "Emami", "Colgate", "VST"],
  Auto: ["Maruti", "Hyundai", "Mahindra", "Tata Motors", "Hero MotoCorp", "Bajaj Auto", "TVS", "Ashok Leyland", "Eicher", "Bosch"],
  Energy: ["NTPC", "Power Grid", "ONGC", "Coal India", "Reliance", "Adani Power", "JSW Energy", "GAIL", "IOC", "IOCL"]
};

export function generateMockStocks(count: number): Stock[] {
  const stocks: Stock[] = [];

  // Get all available stock names
  const allNames: { name: string; sector: string }[] = [];
  Object.entries(STOCK_NAMES).forEach(([sector, names]) => {
    names.forEach((name: string) => allNames.push({ name, sector }));
  });

  for (let i = 0; i < count; i++) {
    const stockData = allNames[i % allNames.length];
    const basePrice = 100 + Math.random() * 4900;
    const changePercent = Math.round((Math.random() * 10 - 5) * 100) / 100;
    const price = Math.round(basePrice * 100) / 100;
    const dayLow = Math.round(price * 0.95 * 100) / 100;
    const dayHigh = Math.round(price * 1.05 * 100) / 100;
    const fiftyTwoWeekLow = Math.round(price * 0.7 * 100) / 100;
    const fiftyTwoWeekHigh = Math.round(price * 1.4 * 100) / 100;

    stocks.push({
      symbol: `${stockData.name.toUpperCase().replace(/\\s+/g, "")}`,
      name: stockData.name,
      price,
      changePercent,
      sector: stockData.sector,
      marketCap: Math.round(Math.random() * 500000),
      pe: Math.round((10 + Math.random() * 50) * 10) / 10,
      volume: Math.round(Math.random() * 10000000),
      dayHigh,
      dayLow,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
    });
  }

  return stocks;
}