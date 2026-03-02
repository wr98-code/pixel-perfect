import React, { memo } from 'react';
import { colors, radii, typography } from '@/styles/tokens';
import { formatDelta } from '@/utils/formatters';

interface ChangeBadgeProps {
  value: number;
  style?: React.CSSProperties;
}

const ChangeBadge: React.FC<ChangeBadgeProps> = memo(function ChangeBadge({ value, style }) {
  const isPositive = value >= 0;
  const arrow = isPositive ? '↑' : '↓';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      padding: '2px 8px',
      borderRadius: radii.badge,
      fontSize: 10,
      fontWeight: 600,
      fontFamily: typography.fontFamily,
      ...typography.tabularNums,
      background: isPositive ? colors.positiveDim : colors.negativeDim,
      border: `1px solid ${isPositive ? colors.positiveMid : colors.negativeMid}`,
      color: isPositive ? colors.positive : colors.negative,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {arrow} {formatDelta(value)}
    </span>
  );
});

export default ChangeBadge;
