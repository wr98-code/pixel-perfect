import React, { memo, useState, useCallback } from 'react';
import { colors, shadows, typography } from '@/styles/tokens';
import RegimeBadge from '@/components/shared/RegimeBadge';
import { mockGlobalData, mockRegime } from '@/data/mockData';
import { formatCompact } from '@/utils/formatters';

const Topbar: React.FC = memo(function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  const stats = [
    { label: 'BTC', value: '$67,234' },
    { label: 'ETH', value: '$3,521' },
    { label: 'MCAP', value: formatCompact(mockGlobalData.total_market_cap) },
    { label: 'VOL', value: formatCompact(mockGlobalData.total_volume) },
    { label: 'DOM', value: `${mockGlobalData.btc_dominance}%` },
    { label: 'F&G', value: '71' },
  ];

  return (
    <header style={{
      height: 52,
      position: 'fixed',
      top: 0,
      left: 220,
      right: 0,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${colors.borderFaint}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 40,
      fontFamily: typography.fontFamily,
    }}>
      {/* Left: Global stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        overflow: 'hidden',
      }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div style={{
              width: 1,
              height: 20,
              background: colors.borderFaint,
              margin: '0 10px',
              flexShrink: 0,
            }} />}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              <span style={{
                fontSize: 10,
                fontWeight: 500,
                color: colors.textMuted,
              }}>{s.label}</span>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: colors.textPrimary,
                ...typography.tabularNums,
              }}>{s.value}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Center: Search */}
      <div style={{
        position: 'relative',
        width: searchFocused ? 400 : 320,
        transition: 'width 250ms ease',
      }}>
        <input
          type="text"
          placeholder="Search assets, pages... ⌘K"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: '100%',
            height: 32,
            padding: '0 12px',
            border: `1px solid ${searchFocused ? colors.borderAccent : colors.borderMuted}`,
            borderRadius: 8,
            fontSize: 11,
            fontFamily: typography.fontFamily,
            color: colors.textPrimary,
            background: searchFocused ? 'rgba(255,255,255,1)' : colors.card,
            boxShadow: searchFocused ? shadows.focusRing : 'none',
            outline: 'none',
            transition: 'all 200ms ease',
          }}
        />
      </div>

      {/* Right: Regime + icons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <RegimeBadge regime={mockRegime} />
        <button style={{
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: colors.textMuted,
          fontSize: 14,
          borderRadius: 6,
        }} aria-label="Notifications">🔔</button>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: colors.accentDim,
          border: `1px solid ${colors.borderMuted}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: colors.accent,
        }}>Z</div>
      </div>
    </header>
  );
});

export default Topbar;
