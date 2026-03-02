import type { CryptoAsset, GlobalData, FearGreedData, NewsItem, MarketRegime } from '@/types/crypto';

function generateSparkline(base: number, volatility: number): number[] {
  const points: number[] = [];
  let price = base;
  for (let i = 0; i < 168; i++) {
    price += (Math.random() - 0.48) * volatility;
    points.push(Math.max(price, base * 0.7));
  }
  return points;
}

export const mockAssets: CryptoAsset[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 67234.52, market_cap: 1320000000000, total_volume: 28500000000, price_change_percentage_24h: 2.34, price_change_percentage_7d_in_currency: 5.67, market_cap_rank: 1, sparkline_in_7d: { price: generateSparkline(65000, 500) } },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 3521.87, market_cap: 423000000000, total_volume: 14200000000, price_change_percentage_24h: 1.82, price_change_percentage_7d_in_currency: 3.21, market_cap_rank: 2, sparkline_in_7d: { price: generateSparkline(3400, 30) } },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', current_price: 178.43, market_cap: 82000000000, total_volume: 3200000000, price_change_percentage_24h: 4.56, price_change_percentage_7d_in_currency: 12.34, market_cap_rank: 3, sparkline_in_7d: { price: generateSparkline(160, 5) } },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price: 612.35, market_cap: 94000000000, total_volume: 1800000000, price_change_percentage_24h: 0.87, price_change_percentage_7d_in_currency: 2.15, market_cap_rank: 4, sparkline_in_7d: { price: generateSparkline(600, 8) } },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', current_price: 0.6234, market_cap: 34000000000, total_volume: 1200000000, price_change_percentage_24h: -1.23, price_change_percentage_7d_in_currency: -0.87, market_cap_rank: 5, sparkline_in_7d: { price: generateSparkline(0.63, 0.01) } },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', current_price: 0.4521, market_cap: 16000000000, total_volume: 420000000, price_change_percentage_24h: -2.14, price_change_percentage_7d_in_currency: -4.32, market_cap_rank: 6, sparkline_in_7d: { price: generateSparkline(0.46, 0.008) } },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', current_price: 38.72, market_cap: 14500000000, total_volume: 580000000, price_change_percentage_24h: 3.45, price_change_percentage_7d_in_currency: 8.76, market_cap_rank: 7, sparkline_in_7d: { price: generateSparkline(36, 1.2) } },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', current_price: 0.1234, market_cap: 17800000000, total_volume: 890000000, price_change_percentage_24h: 1.56, price_change_percentage_7d_in_currency: 6.78, market_cap_rank: 8, sparkline_in_7d: { price: generateSparkline(0.12, 0.003) } },
  { id: 'polkadot', symbol: 'dot', name: 'Polkadot', image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', current_price: 7.82, market_cap: 10200000000, total_volume: 340000000, price_change_percentage_24h: -0.45, price_change_percentage_7d_in_currency: 1.23, market_cap_rank: 9, sparkline_in_7d: { price: generateSparkline(7.7, 0.15) } },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', current_price: 14.56, market_cap: 8500000000, total_volume: 520000000, price_change_percentage_24h: 2.87, price_change_percentage_7d_in_currency: 4.56, market_cap_rank: 10, sparkline_in_7d: { price: generateSparkline(14, 0.4) } },
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap', image: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', current_price: 9.87, market_cap: 5900000000, total_volume: 210000000, price_change_percentage_24h: 1.23, price_change_percentage_7d_in_currency: 3.45, market_cap_rank: 11, sparkline_in_7d: { price: generateSparkline(9.5, 0.2) } },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png', current_price: 72.34, market_cap: 5400000000, total_volume: 380000000, price_change_percentage_24h: 0.65, price_change_percentage_7d_in_currency: 1.87, market_cap_rank: 12, sparkline_in_7d: { price: generateSparkline(71, 1.5) } },
];

export const mockGlobalData: GlobalData = {
  total_market_cap: 2420000000000,
  total_volume: 98000000000,
  btc_dominance: 54.2,
  eth_dominance: 17.5,
  market_cap_change_percentage_24h: 1.87,
};

export const mockFearGreed: FearGreedData = {
  value: 71,
  value_classification: 'Greed',
  timestamp: new Date().toISOString(),
};

export const mockNews: NewsItem[] = [
  { id: '1', title: 'Bitcoin Surges Past $67K as Institutional Demand Accelerates', body: 'Major institutional players continue to accumulate Bitcoin...', source: 'CryptoCompare', url: '#', published_on: Date.now() / 1000 - 1800 },
  { id: '2', title: 'Ethereum L2 Networks Hit Record TVL of $45B', body: 'Layer 2 scaling solutions show unprecedented growth...', source: 'CoinPaprika', url: '#', published_on: Date.now() / 1000 - 5400 },
  { id: '3', title: 'SEC Approves New Crypto ETF Framework for 2026', body: 'Regulatory clarity brings optimism to digital asset markets...', source: 'CryptoCompare', url: '#', published_on: Date.now() / 1000 - 10800 },
];

export const mockRegime: MarketRegime = 'BULL';
