import React, { memo, useState, useMemo } from 'react';
import { colors, typography } from '@/styles/tokens';
import ChangeBadge from '@/components/shared/ChangeBadge';

const pairs = ['BTC-PERP', 'ETH-PERP', 'SOL-PERP', 'BNB-PERP', 'XRP-PERP'];

const TerminalTopbar: React.FC = memo(function TerminalTopbar() {
  const [selectedPair, setSelectedPair] = useState('BTC-PERP');
  const [showPairMenu, setShowPairMenu] = useState(false);

  const stats = useMemo(() => [
    { label: 'Mark', value: '$67,234.52', delta: 1.24 },
    { label: 'Index', value: '$67,228.10', delta: undefined },
    { label: 'Funding', value: '+0.0100%', color: colors.warning, sub: 'in 2h 32m' },
    { label: 'OI', value: '$2.4B', delta: undefined },
    { label: 'Vol 24h', value: '$8.2B', delta: undefined },
  ], []);

  return (
    <div style={{
      height: 48,
      background: colors.cardHover,
      borderBottom: `1px solid ${colors.borderMuted}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 0,
      fontFamily: typography.fontFamily,
      flexShrink: 0,
    }}>
      {/* Pair selector */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowPairMenu(!showPairMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'transparent',
            border: `1px solid ${colors.borderMuted}`,
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
            fontSize: 12,
            fontWeight: 700,
            color: colors.textPrimary,
          }}
        >
          {selectedPair} <span style={{ fontSize: 8, color: colors.textMuted }}>▼</span>
        </button>
        {showPairMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            background: colors.modal,
            border: `1px solid ${colors.borderStrong}`,
            borderRadius: 8,
            padding: 4,
            zIndex: 100,
            minWidth: 140,
          }}>
            {pairs.map(p => (
              <button
                key={p}
                onClick={() => { setSelectedPair(p); setShowPairMenu(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '6px 10px',
                  border: 'none',
                  background: p === selectedPair ? colors.accentDim : 'transparent',
                  color: p === selectedPair ? colors.accent : colors.textPrimary,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: typography.fontFamily,
                  cursor: 'pointer',
                  borderRadius: 4,
                  textAlign: 'left',
                }}
              >{p}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 24, background: colors.borderFaint, margin: '0 12px' }} />

      {/* Stats */}
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div style={{ width: 1, height: 20, background: colors.borderFaint, margin: '0 10px' }} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, color: colors.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: s.color || colors.textPrimary,
              ...typography.tabularNums,
            }}>{s.value}</span>
            {s.delta !== undefined && <ChangeBadge value={s.delta} />}
            {s.sub && <span style={{ fontSize: 9, color: colors.textFaint }}>{s.sub}</span>}
          </div>
        </React.Fragment>
      ))}

      <div style={{ flex: 1 }} />

      {/* Right: Long/Short ratio */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 9, color: colors.textMuted }}>L/S</span>
          <div style={{
            width: 60,
            height: 6,
            borderRadius: 3,
            background: colors.negativeDim,
            overflow: 'hidden',
            display: 'flex',
          }}>
            <div style={{
              width: '62%',
              height: '100%',
              background: colors.positive,
              borderRadius: '3px 0 0 3px',
            }} />
          </div>
          <span style={{ fontSize: 9, color: colors.positive, fontWeight: 600, ...typography.tabularNums }}>62%</span>
        </div>
        <button style={{
          width: 28,
          height: 28,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: colors.textMuted,
          fontSize: 14,
          borderRadius: 4,
        }} aria-label="Settings">⚙</button>
        <button style={{
          width: 28,
          height: 28,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: colors.textMuted,
          fontSize: 14,
          borderRadius: 4,
        }} aria-label="Fullscreen">⛶</button>
      </div>
    </div>
  );
});

export default TerminalTopbar;
