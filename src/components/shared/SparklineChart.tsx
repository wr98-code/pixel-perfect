import React, { memo, useMemo } from 'react';
import { colors } from '@/styles/tokens';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  style?: React.CSSProperties;
}

const SparklineChart: React.FC<SparklineChartProps> = memo(function SparklineChart({ 
  data, 
  width = 80, 
  height = 28, 
  positive,
  style 
}) {
  const { path, fillPath, isPositive } = useMemo(() => {
    if (!data || data.length < 2) return { path: '', fillPath: '', isPositive: true };
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    
    const points = data.map((v, i) => ({
      x: i * step,
      y: height - ((v - min) / range) * (height - 4) - 2,
    }));
    
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const fill = `${linePath} L${width},${height} L0,${height} Z`;
    
    return {
      path: linePath,
      fillPath: fill,
      isPositive: positive !== undefined ? positive : data[data.length - 1] >= data[0],
    };
  }, [data, width, height, positive]);

  const strokeColor = isPositive ? colors.positive : colors.negative;
  const fillColor = isPositive ? 'rgba(0, 160, 100, 0.12)' : 'rgba(210, 40, 80, 0.12)';

  return (
    <svg width={width} height={height} style={{ display: 'block', ...style }} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-grad-${isPositive ? 'p' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#spark-grad-${isPositive ? 'p' : 'n'})`} />
      <path d={path} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

export default SparklineChart;
