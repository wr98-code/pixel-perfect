export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number | null;
  market_cap_rank: number;
  sparkline_in_7d: { price: number[] } | null;
}

export interface GlobalData {
  total_market_cap: number;
  total_volume: number;
  btc_dominance: number;
  eth_dominance: number;
  market_cap_change_percentage_24h: number;
}

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  source: string;
  url: string;
  published_on: number;
  imageurl?: string;
}

export type MarketRegime = 'SURGE' | 'BULL' | 'CRAB' | 'BEAR';

export interface PriceUpdate {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  timestamp: number;
}
