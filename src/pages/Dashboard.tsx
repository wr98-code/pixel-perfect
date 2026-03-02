import React, { memo, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { colors, shadows, typography, springs } from '@/styles/tokens';
import GlassCard from '@/components/shared/GlassCard';
import MetricCard from '@/components/shared/MetricCard';
import ChangeBadge from '@/components/shared/ChangeBadge';
import SparklineChart from '@/components/shared/SparklineChart';
import FearGreedGauge from '@/components/shared/FearGreedGauge';
import RegimeBadge from '@/components/shared/RegimeBadge';
import { mockAssets, mockGlobalData, mockFearGreed, mockNews, mockRegime } from '@/data/mockData';
import { formatCompact, formatPrice, formatDelta } from '@/utils/formatters';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.soft },
};

const Dashboard: React.FC = memo(function Dashboard() {
  const now = useMemo(() => new Date(), []);
  const topGainer = useMemo(() => [...mockAssets].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0], []);
  const topLoser = useMemo(() => [...mockAssets].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)[0], []);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  const regimeDescription: Record<string, string> = {
    SURGE: 'Extreme bullish momentum across all sectors',
    BULL: 'Broad market uptrend with strong momentum',
    CRAB: 'Sideways consolidation, low directional bias',
    BEAR: 'Broad market decline, risk-off sentiment',
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Page header */}
      <motion.div variants={fadeUp} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        height: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 2, height: 20, background: colors.accent, borderRadius: 1 }} />
          <h1 style={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.textPrimary,
            fontFamily: typography.fontFamily,
            margin: 0,
          }}>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10,
            color: colors.textMuted,
            fontFamily: typography.fontFamily,
          }}>{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.accent,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </div>
      </motion.div>

      {/* Global Metrics */}
      <motion.div variants={fadeUp}>
        <GlassCard style={{ padding: 0, marginBottom: 16 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
          }}>
            {[
              { label: 'Market Cap', value: formatCompact(mockGlobalData.total_market_cap), delta: mockGlobalData.market_cap_change_percentage_24h },
              { label: '24H Volume', value: formatCompact(mockGlobalData.total_volume), delta: 3.21 },
              { label: 'BTC Dominance', value: `${mockGlobalData.btc_dominance}%`, delta: 0.34 },
              { label: 'ETH Dominance', value: `${mockGlobalData.eth_dominance}%`, delta: -0.12 },
              { label: 'Fear & Greed', value: String(mockFearGreed.value), delta: 4 },
            ].map((m, i) => (
              <div key={m.label} style={{
                borderRight: i < 4 ? `1px solid ${colors.borderFaint}` : 'none',
              }}>
                <MetricCard label={m.label} value={m.value} delta={m.delta} />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Regime Banner */}
      <motion.div variants={fadeUp} style={{
        height: 48,
        background: colors.cardHover,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        marginBottom: 16,
        borderLeft: `3px solid ${colors.positive}`,
        boxShadow: 'inset 3px 0 12px rgba(0,160,100,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RegimeBadge regime={mockRegime} />
          <span style={{
            fontSize: 11,
            color: colors.textMuted,
            fontFamily: typography.fontFamily,
          }}>{regimeDescription[mockRegime]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.positive,
            fontFamily: typography.fontFamily,
          }}>Top: {topGainer.symbol.toUpperCase()}</span>
          <ChangeBadge value={topGainer.price_change_percentage_24h} />
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.negative,
            fontFamily: typography.fontFamily,
          }}>Bottom: {topLoser.symbol.toUpperCase()}</span>
          <ChangeBadge value={topLoser.price_change_percentage_24h} />
        </div>
      </motion.div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: 16,
        marginBottom: 16,
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Price Chart */}
          <motion.div variants={fadeUp}>
            <GlassCard title="BTC / USD" actions={
              <div style={{ display: 'flex', gap: 2 }}>
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    style={{
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: typography.fontFamily,
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      background: tf === selectedTimeframe ? colors.accentDim : 'transparent',
                      color: tf === selectedTimeframe ? colors.accent : colors.textMuted,
                      borderBottom: tf === selectedTimeframe ? `2px solid ${colors.accent}` : '2px solid transparent',
                      transition: 'all 150ms ease',
                    }}
                  >{tf}</button>
                ))}
              </div>
            }>
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {mockAssets[0].sparkline_in_7d && (
                  <SparklineChart
                    data={mockAssets[0].sparkline_in_7d.price}
                    width={700}
                    height={260}
                    positive={true}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    fontFamily: typography.fontFamily,
                    ...typography.tabularNums,
                  }}>{formatPrice(mockAssets[0].current_price)}</span>
                  <ChangeBadge value={mockAssets[0].price_change_percentage_24h} />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Top Movers */}
          <motion.div variants={fadeUp}>
            <TopMoversCard />
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Fear & Greed */}
          <motion.div variants={fadeUp}>
            <GlassCard title="Fear & Greed">
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <FearGreedGauge value={mockFearGreed.value} label={mockFearGreed.value_classification} />
              </div>
            </GlassCard>
          </motion.div>

          {/* News */}
          <motion.div variants={fadeUp}>
            <GlassCard title="Latest News">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mockNews.map(item => (
                  <div key={item.id} style={{
                    paddingBottom: 10,
                    borderBottom: `1px solid ${colors.borderFaint}`,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: colors.accentDim,
                        color: colors.accent,
                        fontFamily: typography.fontFamily,
                      }}>{item.source}</span>
                      <span style={{
                        fontSize: 9,
                        color: colors.textFaint,
                        fontFamily: typography.fontFamily,
                      }}>{new Date(item.published_on * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <a href={item.url} style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily,
                      textDecoration: 'none',
                      lineHeight: 1.4,
                    }}>{item.title}</a>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Markets Preview */}
      <motion.div variants={fadeUp}>
        <GlassCard title="Markets" actions={
          <a href="/markets" style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.accent,
            fontFamily: typography.fontFamily,
            textDecoration: 'none',
          }}>View all →</a>
        }>
          <MarketsPreviewTable />
        </GlassCard>
      </motion.div>
    </motion.div>
  );
});

const TopMoversCard: React.FC = memo(function TopMoversCard() {
  const [tab, setTab] = useState<'gainers' | 'losers'>('gainers');
  const sorted = useMemo(() => {
    const s = [...mockAssets].sort((a, b) =>
      tab === 'gainers'
        ? b.price_change_percentage_24h - a.price_change_percentage_24h
        : a.price_change_percentage_24h - b.price_change_percentage_24h
    );
    return s.slice(0, 5);
  }, [tab]);

  return (
    <GlassCard title="Top Movers" actions={
      <div style={{ display: 'flex', gap: 2 }}>
        {(['gainers', 'losers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '2px 10px',
            fontSize: 10,
            fontWeight: 600,
            fontFamily: typography.fontFamily,
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            background: tab === t ? colors.accentDim : 'transparent',
            color: tab === t ? colors.accent : colors.textMuted,
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>
    }>
      {sorted.map(asset => (
        <div key={asset.id} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          padding: '0 4px',
          borderBottom: `1px solid ${colors.borderFaint}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={asset.image} alt={asset.name} style={{ width: 20, height: 20, borderRadius: '50%' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, fontFamily: typography.fontFamily }}>{asset.name}</span>
            <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: typography.fontFamily }}>{asset.symbol.toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily,
              ...typography.tabularNums,
            }}>{formatPrice(asset.current_price)}</span>
            <ChangeBadge value={asset.price_change_percentage_24h} />
            {asset.sparkline_in_7d && (
              <SparklineChart data={asset.sparkline_in_7d.price} width={60} height={20} positive={asset.price_change_percentage_24h >= 0} />
            )}
          </div>
        </div>
      ))}
    </GlassCard>
  );
});

const MarketsPreviewTable: React.FC = memo(function MarketsPreviewTable() {
  const top10 = useMemo(() => mockAssets.slice(0, 10), []);

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '32px 200px 96px 72px 72px 100px 96px 96px',
        height: 32,
        alignItems: 'center',
        borderBottom: `1px solid ${colors.borderFaint}`,
      }}>
        {['#', 'Asset', 'Price', '24h', '7d', 'Market Cap', 'Volume', 'Chart'].map(col => (
          <span key={col} style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: typography.fontFamily,
            textAlign: col === 'Price' || col === 'Market Cap' || col === 'Volume' ? 'right' : 'left',
            paddingRight: col === 'Price' || col === 'Market Cap' || col === 'Volume' ? 8 : 0,
          }}>{col}</span>
        ))}
      </div>
      {/* Rows */}
      {top10.map(asset => (
        <MarketRow key={asset.id} asset={asset} />
      ))}
    </div>
  );
});

const MarketRow: React.FC<{ asset: typeof mockAssets[0] }> = memo(function MarketRow({ asset }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 200px 96px 72px 72px 100px 96px 96px',
        height: 44,
        alignItems: 'center',
        background: hovered ? colors.cardHover : 'transparent',
        borderLeft: hovered ? `2px solid ${colors.accent}` : '2px solid transparent',
        cursor: 'pointer',
        transition: 'background 80ms linear',
        borderBottom: `1px solid ${colors.borderFaint}`,
      }}
    >
      <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: typography.fontFamily, ...typography.tabularNums }}>{asset.market_cap_rank}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={asset.image} alt={asset.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, fontFamily: typography.fontFamily }}>{asset.name}</span>
        <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: typography.fontFamily }}>{asset.symbol.toUpperCase()}</span>
      </div>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        textAlign: 'right',
        paddingRight: 8,
      }}>{formatPrice(asset.current_price)}</span>
      <ChangeBadge value={asset.price_change_percentage_24h} />
      <ChangeBadge value={asset.price_change_percentage_7d_in_currency ?? 0} />
      <span style={{
        fontSize: 11,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        textAlign: 'right',
        paddingRight: 8,
      }}>{formatCompact(asset.market_cap)}</span>
      <span style={{
        fontSize: 11,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        textAlign: 'right',
        paddingRight: 8,
      }}>{formatCompact(asset.total_volume)}</span>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {asset.sparkline_in_7d && (
          <SparklineChart data={asset.sparkline_in_7d.price} width={80} height={28} positive={asset.price_change_percentage_24h >= 0} />
        )}
      </div>
    </div>
  );
});

export default Dashboard;
