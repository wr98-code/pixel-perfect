import React, { memo } from 'react';
import { colors, typography } from '@/styles/tokens';
import ChangeBadge from './ChangeBadge';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: number;
  style?: React.CSSProperties;
}

const MetricCard: React.FC<MetricCardProps> = memo(function MetricCard({ label, value, delta, style }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '12px 16px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 200ms ease',
        ...style,
      }}
    >
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: typography.fontFamily,
      }}>{label}</span>
      <span style={{
        fontSize: 18,
        fontWeight: 700,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
      }}>{value}</span>
      {delta !== undefined && <ChangeBadge value={delta} />}
    </div>
  );
});

export default MetricCard;
