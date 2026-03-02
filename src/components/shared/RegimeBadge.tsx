import React, { memo, useMemo } from 'react';
import { colors, radii, typography } from '@/styles/tokens';
import type { MarketRegime } from '@/types/crypto';

interface RegimeBadgeProps {
  regime: MarketRegime;
  style?: React.CSSProperties;
}

const regimeConfig: Record<MarketRegime, { icon: string; bg: string; border: string; color: string; pulse: boolean }> = {
  SURGE: { icon: '🔥', bg: 'rgba(200,80,0,0.08)', border: 'rgba(200,80,0,0.3)', color: 'rgba(200,80,0,1)', pulse: true },
  BULL: { icon: '↑', bg: colors.positiveDim, border: colors.positiveMid, color: colors.positive, pulse: false },
  CRAB: { icon: '⇌', bg: colors.warningDim, border: colors.warningMid, color: colors.warning, pulse: false },
  BEAR: { icon: '↓', bg: colors.negativeDim, border: colors.negativeMid, color: colors.negative, pulse: true },
};

const RegimeBadge: React.FC<RegimeBadgeProps> = memo(function RegimeBadge({ regime, style }) {
  const config = useMemo(() => regimeConfig[regime], [regime]);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 10px',
      borderRadius: radii.badge,
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.10em',
      fontFamily: typography.fontFamily,
      background: config.bg,
      border: `1px solid ${config.border}`,
      color: config.color,
      animation: config.pulse ? 'regimePulse 2s ease-in-out infinite' : 'none',
      ...style,
    }}>
      {config.icon} {regime}
    </span>
  );
});

export default RegimeBadge;
