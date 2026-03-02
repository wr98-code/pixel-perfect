const MINUS_SIGN = '\u2212'; // U+2212 proper minus sign

export function formatPrice(n: number): string {
  if (n == null || isNaN(n)) return '$0.00';
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `${MINUS_SIGN}$${formatted}` : `$${formatted}`;
}

export function formatCompact(n: number): string {
  if (n == null || isNaN(n)) return '$0';
  const abs = Math.abs(n);
  const sign = n < 0 ? MINUS_SIGN : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatDelta(n: number): string {
  if (n == null || isNaN(n)) return '0.00%';
  const sign = n > 0 ? '+' : n < 0 ? MINUS_SIGN : '';
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

export function formatNumber(n: number, decimals: number = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
