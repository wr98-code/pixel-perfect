import React, { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { colors, typography, shadows } from '@/styles/tokens';

// Generate mock candlestick data
function generateCandles(count: number): Candle[] {
  const candles: Candle[] = [];
  let price = 67000;
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const open = price + (Math.random() - 0.48) * 200;
    const close = open + (Math.random() - 0.48) * 400;
    const high = Math.max(open, close) + Math.random() * 150;
    const low = Math.min(open, close) - Math.random() * 150;
    const volume = 500 + Math.random() * 2000;
    candles.push({ time: now - (count - i) * 60000, open, high, low, close, volume });
    price = close;
  }
  return candles;
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const indicators = ['MA', 'BB', 'RSI', 'MACD', 'VOL'];

const ChartPanel: React.FC = memo(function ChartPanel() {
  const [selectedTf, setSelectedTf] = useState('15m');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['VOL']);
  const [crosshair, setCrosshair] = useState<{ x: number; candle: Candle } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const candles = useMemo(() => generateCandles(80), [selectedTf]);

  const toggleIndicator = useCallback((ind: string) => {
    setActiveIndicators(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  }, []);

  // Draw chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, w, h);

    if (candles.length === 0) return;

    const padding = { top: 20, right: 60, bottom: 40, left: 10 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice || 1;

    const candleW = chartW / candles.length;
    const bodyW = Math.max(candleW * 0.6, 2);

    const toY = (price: number) => padding.top + (1 - (price - minPrice) / priceRange) * chartH;
    const toX = (i: number) => padding.left + (i + 0.5) * candleW;

    // Grid lines
    ctx.strokeStyle = 'rgba(15,40,100,0.04)';
    ctx.lineWidth = 0.5;
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice - (i / gridLines) * priceRange;
      ctx.fillStyle = 'rgba(120,130,165,1)';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(0)}`, w - padding.right + 6, y + 3);
    }

    // Volume bars (if enabled)
    if (activeIndicators.includes('VOL')) {
      const maxVol = Math.max(...candles.map(c => c.volume));
      const volH = chartH * 0.15;
      candles.forEach((c, i) => {
        const x = toX(i);
        const barH = (c.volume / maxVol) * volH;
        const isBull = c.close >= c.open;
        ctx.fillStyle = isBull ? 'rgba(0,160,100,0.12)' : 'rgba(210,40,80,0.12)';
        ctx.fillRect(x - bodyW / 2, padding.top + chartH - barH, bodyW, barH);
      });
    }

    // Candles
    candles.forEach((c, i) => {
      const x = toX(i);
      const isBull = c.close >= c.open;
      const color = isBull ? 'rgba(0,160,100,1)' : 'rgba(210,40,80,1)';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.stroke();

      // Body
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBot = toY(Math.min(c.open, c.close));
      const bodyHeight = Math.max(bodyBot - bodyTop, 1);

      if (isBull) {
        ctx.fillStyle = 'rgba(0,160,100,0.15)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
        ctx.strokeRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
      }
    });

    // MA overlay (if enabled)
    if (activeIndicators.includes('MA')) {
      const period = 20;
      ctx.strokeStyle = 'rgba(15,40,180,0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = period - 1; i < candles.length; i++) {
        const avg = candles.slice(i - period + 1, i + 1).reduce((s, c) => s + c.close, 0) / period;
        const x = toX(i);
        const y = toY(avg);
        if (i === period - 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Crosshair
    if (crosshair) {
      ctx.strokeStyle = 'rgba(15,40,100,0.15)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(crosshair.x, padding.top);
      ctx.lineTo(crosshair.x, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [candles, activeIndicators, crosshair]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 10, right: 60 };
    const chartW = rect.width - padding.left - padding.right;
    const candleW = chartW / candles.length;
    const idx = Math.floor((x - padding.left) / candleW);
    if (idx >= 0 && idx < candles.length) {
      setCrosshair({ x, candle: candles[idx] });
    }
  }, [candles]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${colors.borderFaint}`,
      minWidth: 0,
    }}>
      {/* Toolbar */}
      <div style={{
        height: 36,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: 2,
        borderBottom: `1px solid ${colors.borderFaint}`,
        flexShrink: 0,
      }}>
        {timeframes.map(tf => (
          <button key={tf} onClick={() => setSelectedTf(tf)} style={{
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 600,
            fontFamily: typography.fontFamily,
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            background: tf === selectedTf ? colors.accentDim : 'transparent',
            color: tf === selectedTf ? colors.accent : colors.textMuted,
            borderBottom: tf === selectedTf ? `2px solid ${colors.accent}` : '2px solid transparent',
          }}>{tf}</button>
        ))}
        <div style={{ width: 1, height: 16, background: colors.borderFaint, margin: '0 6px' }} />
        {indicators.map(ind => (
          <button key={ind} onClick={() => toggleIndicator(ind)} style={{
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 600,
            fontFamily: typography.fontFamily,
            border: `1px solid ${activeIndicators.includes(ind) ? colors.borderAccent : colors.borderFaint}`,
            borderRadius: 4,
            cursor: 'pointer',
            background: activeIndicators.includes(ind) ? colors.accentDim : 'transparent',
            color: activeIndicators.includes(ind) ? colors.accent : colors.textMuted,
          }}>{ind}</button>
        ))}
      </div>

      {/* Chart */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCrosshair(null)}
          style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
        />
        {/* OHLCV pill */}
        {crosshair && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 8,
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: 6,
            border: `1px solid ${colors.borderFaint}`,
            fontSize: 10,
            fontFamily: typography.fontFamily,
            ...typography.tabularNums,
            boxShadow: shadows.card,
          }}>
            <span style={{ color: colors.textMuted }}>O</span>
            <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{crosshair.candle.open.toFixed(2)}</span>
            <span style={{ color: colors.textMuted }}>H</span>
            <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{crosshair.candle.high.toFixed(2)}</span>
            <span style={{ color: colors.textMuted }}>L</span>
            <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{crosshair.candle.low.toFixed(2)}</span>
            <span style={{ color: colors.textMuted }}>C</span>
            <span style={{ color: crosshair.candle.close >= crosshair.candle.open ? colors.positive : colors.negative, fontWeight: 600 }}>
              {crosshair.candle.close.toFixed(2)}
            </span>
            <span style={{ color: colors.textMuted }}>Vol</span>
            <span style={{ color: colors.textSecondary }}>{crosshair.candle.volume.toFixed(0)}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChartPanel;
