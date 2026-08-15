/**
 * Indian Market Number Formatting Utilities
 * Converts numbers to Indian numbering system (Lakh, Crore, etc.)
 */

export function formatIndianNumber(num: number): string {
  if (num === 0) return '0';

  if (num >= 1e11) {
    // Lakh Crore (100+ Cr)
    return (num / 1e7).toFixed(2) + ' LCr';
  } else if (num >= 1e9) {
    // Crore
    return (num / 1e7).toFixed(2) + ' Cr';
  } else if (num >= 1e5) {
    // Lakh
    return (num / 1e5).toFixed(2) + ' L';
  } else if (num >= 1e3) {
    // Thousand
    return (num / 1e3).toFixed(2) + ' K';
  }

  return num.toFixed(2);
}

export function formatMarketCap(marketCap: number): string {
  // Market cap always in Crore
  return '₹' + (marketCap / 1e7).toFixed(2) + ' Cr';
}

export function formatVolume(volume: number): string {
  if (volume >= 1e7) {
    return (volume / 1e7).toFixed(2) + ' Cr';
  } else if (volume >= 1e5) {
    return (volume / 1e5).toFixed(2) + ' L';
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(2) + ' K';
  }
  return volume.toString();
}

export function formatPrice(price: number): string {
  return '₹' + price.toFixed(2);
}

export function formatPercentage(percent: number): string {
  return percent.toFixed(2) + '%';
}

export function formatPE(pe: number): string {
  return pe.toFixed(2);
}
