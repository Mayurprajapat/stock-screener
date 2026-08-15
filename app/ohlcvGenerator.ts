// ohlcvGenerator.ts
export interface Candle {
  time: string; // "YYYY-MM-DD" format
  open: number;
  high: number;
  low: number;
  close: number;
}

function normalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function generateOHLCV(startPrice: number, days: number = 252): Candle[] {
  const candles: Candle[] = [];
  let currentPrice = startPrice;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Saturday/Sunday skip kar (trading days nahi hote)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyReturn = normalRandom() * 0.02;
    const open = currentPrice;
    const close = open * (1 + dailyReturn);
    const high = Math.max(open, close) * (1 + Math.abs(normalRandom()) * 0.005);
    const low = Math.min(open, close) * (1 - Math.abs(normalRandom()) * 0.005);

    candles.push({
      time: date.toISOString().split("T")[0], // "2026-08-15" jaisa format
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });

    currentPrice = close;
  }

  return candles;
}