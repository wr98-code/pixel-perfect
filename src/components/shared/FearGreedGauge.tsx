import React, { memo, useMemo } from 'react';
import { colors, typography } from '@/styles/tokens';

interface FearGreedGaugeProps {
  value: number;
  label: string;
}

const FearGreedGauge: React.FC<FearGreedGaugeProps> = memo(function FearGreedGauge({ value, label }) {
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;

  // 180° arc from left to right (bottom half removed)
  const startAngle = Math.PI;
  const endAngle = 0;
  const valueAngle = startAngle - (value / 100) * Math.PI;

  const arcStart = {
    x: cx + radius * Math.cos(startAngle),
    y: cy + radius * Math.sin(startAngle),
  };
  const arcEnd = {
    x: cx + radius * Math.cos(endAngle),
    y: cy + radius * Math.sin(endAngle),
  };
  const dotPos = {
    x: cx + radius * Math.cos(valueAngle),
    y: cy + radius * Math.sin(valueAngle),
  };

  const bgPath = `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`;

  const getColor = useMemo(() => {
    if (value <= 25) return colors.negative;
    if (value <= 45) return colors.warning;
    if (value <= 55) return colors.textMuted;
    if (value <= 75) return colors.positive;
    return colors.positive;
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <defs>
          <linearGradient id="fg-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.negative} />
            <stop offset="40%" stopColor={colors.warning} />
            <stop offset="100%" stopColor={colors.positive} />
          </linearGradient>
        </defs>
        <path d={bgPath} fill="none" stroke="rgba(15,40,100,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={bgPath} fill="none" stroke="url(#fg-gradient)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle cx={dotPos.x} cy={dotPos.y} r={6} fill={getColor} stroke="rgba(255,255,255,1)" strokeWidth={2} />
      </svg>
      <span style={{
        fontSize: 32,
        fontWeight: 700,
        color: getColor,
        fontFamily: typography.fontFamily,
        ...typography.tabularNums,
        marginTop: -20,
      }}>{value}</span>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily,
      }}>{label}</span>
    </div>
  );
});

export default FearGreedGauge;
