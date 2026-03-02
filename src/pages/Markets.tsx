import React, { memo, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { colors, shadows, typography, springs } from '@/styles/tokens';
import GlassCard from '@/components/shared/GlassCard';
import ChangeBadge from '@/components/shared/ChangeBadge';
import SparklineChart from '@/components/shared/SparklineChart';
import { mockAssets } from '@/data/mockData';
import { formatPrice, formatCompact } from '@/utils/formatters';

const filters = ['All', 'DeFi', 'L1', 'L2', 'Stable'];

const Markets: React.FC = memo(function Markets() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortCol, setSortCol] = useState<string>('market_cap_rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = [...mockAssets];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
    }
    return result;
  }, [search, activeFilter]);

  const handleSort = useCallback((col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }, [sortCol]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 2, height: 20, background: colors.accent, borderRadius: 1 }} />
          <h1 style={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.textPrimary,
            fontFamily: typography.fontFamily,
            margin: 0,
          }}>Markets</h1>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 6,
            background: colors.accentDim,
            color: colors.accent,
            fontFamily: typography.fontFamily,
          }}>{filtered.length} assets</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 200,
              height: 32,
              padding: '0 12px',
              border: `1px solid ${colors.borderMuted}`,
              borderRadius: 8,
              fontSize: 11,
              fontFamily: typography.fontFamily,
              color: colors.textPrimary,
              background: colors.card,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '4px 12px',
                fontSize: 10,
                fontWeight: 600,
                fontFamily: typography.fontFamily,
                border: `1px solid ${f === activeFilter ? colors.borderAccent : colors.borderMuted}`,
                borderRadius: 6,
                cursor: 'pointer',
                background: f === activeFilter ? colors.accentDim : 'transparent',
                color: f === activeFilter ? colors.accent : colors.textMuted,
                transition: 'all 150ms ease',
              }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <GlassCard style={{ padding: 0 }}>
        {/* Sticky header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 110px 80px 80px 120px 110px 100px',
          height: 36,
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: `1px solid ${colors.borderMuted}`,
          background: colors.card,
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}>
          {[
            { key: 'rank', label: '#' },
            { key: 'name', label: 'Asset' },
            { key: 'price', label: 'Price' },
            { key: '24h', label: '24h' },
            { key: '7d', label: '7d' },
            { key: 'mcap', label: 'Market Cap' },
            { key: 'vol', label: 'Volume' },
            { key: 'chart', label: 'Chart' },
          ].map(col => (
            <span
              key={col.key}
              onClick={() => handleSort(col.key)}
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: typography.fontFamily,
                cursor: 'pointer',
                userSelect: 'none',
                textAlign: ['price', 'mcap', 'vol'].includes(col.key) ? 'right' : 'left',
              }}
            >{col.label}{sortCol === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map(asset => (
          <MarketRow key={asset.id} asset={asset} searchQuery={search} />
        ))}
      </GlassCard>
    </motion.div>
  );
});

const MarketRow: React.FC<{ asset: typeof mockAssets[0]; searchQuery: string }> = memo(function MarketRow({ asset, searchQuery }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 110px 80px 80px 120px 110px 100px',
        height: 44,
        alignItems: 'center',
        padding: '0 16px',
        background: hovered ? colors.cardHover : 'transparent',
        borderLeft: hovered ? `2px solid ${colors.accent}` : '2px solid transparent',
        cursor: 'pointer',
        transition: 'background 80ms linear',
        borderBottom: `1px solid ${colors.borderFaint}`,
      }}
    >
      <span style={{
        fontSize: 10,
        color: colors.textMuted,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
      }}>{asset.market_cap_rank}</span>
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
      }}>{formatPrice(asset.current_price)}</span>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ChangeBadge value={asset.price_change_percentage_24h} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ChangeBadge value={asset.price_change_percentage_7d_in_currency ?? 0} />
      </div>
      <span style={{
        fontSize: 11,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        textAlign: 'right',
      }}>{formatCompact(asset.market_cap)}</span>
      <span style={{
        fontSize: 11,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        textAlign: 'right',
      }}>{formatCompact(asset.total_volume)}</span>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {asset.sparkline_in_7d && (
          <SparklineChart data={asset.sparkline_in_7d.price} width={80} height={28} positive={asset.price_change_percentage_24h >= 0} />
        )}
      </div>
    </div>
  );
});

export default Markets;
