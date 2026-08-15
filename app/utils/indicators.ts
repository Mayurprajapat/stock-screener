/**
 * Technical Indicators for Stock Charts
 * Implements 5+ indicators: SMA, EMA, RSI, Bollinger Bands, MACD, Stochastic
 */

export interface OHLC {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface IndicatorData {
  sma20: number | null;
  sma50: number | null;
  ema12: number | null;
  ema26: number | null;
  rsi: number | null;
  bollingerUpper: number | null;
  bollingerMiddle: number | null;
  bollingerLower: number | null;
  macd: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
  stochastic: number | null;
  stochasticSignal: number | null;
}

/**
 * Simple Moving Average
 */
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
}

/**
 * Exponential Moving Average
 */
export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      ema.push(prices[0]);
    } else if (i < period) {
      const sum = prices.slice(0, i + 1).reduce((a, b) => a + b, 0);
      ema.push(sum / (i + 1));
    } else {
      ema.push(prices[i] * multiplier + ema[i - 1] * (1 - multiplier));
    }
  }
  return ema;
}

/**
 * Relative Strength Index (RSI)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const deltas: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    deltas.push(prices[i] - prices[i - 1]);
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(NaN);
    } else {
      const gains = deltas.slice(i - period, i).filter((d) => d > 0).reduce((a, b) => a + b, 0);
      const losses = deltas
        .slice(i - period, i)
        .filter((d) => d < 0)
        .reduce((a, b) => a + b, 0);

      const avgGain = gains / period;
      const avgLoss = Math.abs(losses) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsiValue = 100 - 100 / (1 + rs);
      rsi.push(rsiValue);
    }
  }
  return rsi;
}

/**
 * Bollinger Bands
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
): {
  upper: number[];
  middle: number[];
  lower: number[];
} {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const middle: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      middle.push(NaN);
      lower.push(NaN);
    } else {
      const priceSlice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i]!;
      const variance = priceSlice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      middle.push(mean);
      upper.push(mean + stdDevMultiplier * stdDev);
      lower.push(mean - stdDevMultiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

/**
 * MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macd: number[];
  signal: number[];
  histogram: number[];
} {
  const ema12 = calculateEMA(prices, fastPeriod);
  const ema26 = calculateEMA(prices, slowPeriod);

  const macd: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (isNaN(ema12[i]) || isNaN(ema26[i])) {
      macd.push(NaN);
    } else {
      macd.push(ema12[i] - ema26[i]);
    }
  }

  const signal = calculateEMA(macd.filter((m) => !isNaN(m)), signalPeriod);
  const histogram: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (isNaN(macd[i]) || isNaN(signal[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macd[i] - signal[i]);
    }
  }

  return { macd, signal, histogram };
}

/**
 * Stochastic Oscillator
 */
export function calculateStochastic(
  prices: number[],
  period: number = 14,
  smoothK: number = 3,
  smoothD: number = 3
): {
  k: number[];
  d: number[];
} {
  const k: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      k.push(NaN);
    } else {
      const priceSlice = prices.slice(i - period + 1, i + 1);
      const low = Math.min(...priceSlice);
      const high = Math.max(...priceSlice);
      const kValue = ((prices[i] - low) / (high - low)) * 100;
      k.push(kValue);
    }
  }

  const d = calculateSMA(k.filter((v) => !isNaN(v)), smoothD);

  return { k, d };
}

/**
 * Calculate all indicators for a given price series
 */
export function calculateAllIndicators(ohlcData: OHLC[]): IndicatorData[] {
  const closePrices = ohlcData.map((d) => d.close);

  const sma20 = calculateSMA(closePrices, 20);
  const sma50 = calculateSMA(closePrices, 50);
  const ema12 = calculateEMA(closePrices, 12);
  const ema26 = calculateEMA(closePrices, 26);
  const rsi = calculateRSI(closePrices, 14);
  const { upper: bbUpper, middle: bbMiddle, lower: bbLower } = calculateBollingerBands(closePrices, 20, 2);
  const { macd, signal: macdSignal, histogram: macdHistogram } = calculateMACD(closePrices, 12, 26, 9);
  const { k: stoch, d: stochD } = calculateStochastic(closePrices, 14, 3, 3);

  return ohlcData.map((_, i) => ({
    sma20: sma20[i] || null,
    sma50: sma50[i] || null,
    ema12: ema12[i] || null,
    ema26: ema26[i] || null,
    rsi: rsi[i] || null,
    bollingerUpper: bbUpper[i] || null,
    bollingerMiddle: bbMiddle[i] || null,
    bollingerLower: bbLower[i] || null,
    macd: macd[i] || null,
    macdSignal: macdSignal[i] || null,
    macdHistogram: macdHistogram[i] || null,
    stochastic: stoch[i] || null,
    stochasticSignal: stochD[i] || null,
  }));
}
