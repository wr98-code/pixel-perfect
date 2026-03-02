import React, { memo, useState, useMemo, useCallback } from 'react';
import { colors, typography, radii, shadows } from '@/styles/tokens';

const orderTypes = ['Limit', 'Market', 'Stop', 'TP/SL'];

const TradePanel: React.FC = memo(function TradePanel() {
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState('Limit');
  const [price, setPrice] = useState('67,234.52');
  const [size, setSize] = useState('0.100');
  const [leverage, setLeverage] = useState(10);
  const [showTpSl, setShowTpSl] = useState(false);
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');

  const isLong = side === 'long';
  const sideColor = isLong ? colors.positive : colors.negative;
  const sideDimColor = isLong ? colors.positiveDim : colors.negativeDim;
  const sideMidColor = isLong ? colors.positiveMid : colors.negativeMid;

  const leverageColor = useMemo(() => {
    if (leverage >= 40) return colors.negative;
    if (leverage >= 20) return colors.warning;
    return colors.accent;
  }, [leverage]);

  const usdValue = useMemo(() => {
    const p = parseFloat(price.replace(/,/g, '')) || 0;
    const s = parseFloat(size) || 0;
    return (p * s).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [price, size]);

  const liqPrice = useMemo(() => {
    const p = parseFloat(price.replace(/,/g, '')) || 67234.52;
    const margin = p / leverage;
    return isLong ? (p - margin * 0.9).toFixed(2) : (p + margin * 0.9).toFixed(2);
  }, [price, leverage, isLong]);

  const setQuickSize = useCallback((pct: number) => {
    const maxBtc = 2.5;
    setSize((maxBtc * pct / 100).toFixed(3));
  }, []);

  return (
    <div style={{
      width: 280,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: typography.fontFamily,
      flexShrink: 0,
      overflow: 'auto',
    }}>
      {/* Long/Short tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: 40,
        flexShrink: 0,
      }}>
        {(['long', 'short'] as const).map(s => {
          const active = side === s;
          const c = s === 'long' ? colors.positive : colors.negative;
          const cDim = s === 'long' ? colors.positiveDim : colors.negativeDim;
          return (
            <button key={s} onClick={() => setSide(s)} style={{
              border: 'none',
              cursor: 'pointer',
              fontFamily: typography.fontFamily,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: active ? c : colors.textMuted,
              background: active ? cDim : 'transparent',
              borderBottom: active ? `2px solid ${c}` : `2px solid ${colors.borderFaint}`,
              transition: 'all 150ms ease',
            }}>{s}</button>
          );
        })}
      </div>

      <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Order type */}
        <div style={{ display: 'flex', gap: 2 }}>
          {orderTypes.map(t => (
            <button key={t} onClick={() => setOrderType(t)} style={{
              flex: 1,
              padding: '4px 0',
              fontSize: 9,
              fontWeight: 600,
              fontFamily: typography.fontFamily,
              border: `1px solid ${orderType === t ? colors.borderAccent : colors.borderFaint}`,
              borderRadius: 4,
              cursor: 'pointer',
              background: orderType === t ? colors.accentDim : 'transparent',
              color: orderType === t ? colors.accent : colors.textMuted,
            }}>{t}</button>
          ))}
        </div>

        {/* Price input */}
        {orderType !== 'Market' && (
          <div>
            <label style={{ fontSize: 9, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }}>Price</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={price}
                onChange={e => setPrice(e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 40px 0 10px',
                  border: `1px solid ${colors.borderMuted}`,
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: typography.fontFamily,
                  color: colors.textPrimary,
                  background: colors.background,
                  outline: 'none',
                  ...typography.tabularNums,
                }}
              />
              <span style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 9,
                color: colors.textFaint,
                fontWeight: 600,
              }}>USD</span>
            </div>
          </div>
        )}

        {/* Size input */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }}>Size</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={size}
              onChange={e => setSize(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                padding: '0 40px 0 10px',
                border: `1px solid ${colors.borderMuted}`,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: typography.fontFamily,
                color: colors.textPrimary,
                background: colors.background,
                outline: 'none',
                ...typography.tabularNums,
              }}
            />
            <span style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 9,
              color: colors.textFaint,
              fontWeight: 600,
            }}>BTC</span>
          </div>
          <div style={{ fontSize: 9, color: colors.textFaint, marginTop: 2, ...typography.tabularNums }}>
            ≈ ${usdValue}
          </div>
          {/* Quick fill */}
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {[25, 50, 75, 100].map(pct => (
              <button key={pct} onClick={() => setQuickSize(pct)} style={{
                flex: 1,
                padding: '3px 0',
                fontSize: 9,
                fontWeight: 600,
                fontFamily: typography.fontFamily,
                border: `1px solid ${colors.borderFaint}`,
                borderRadius: 4,
                cursor: 'pointer',
                background: colors.accentDim,
                color: colors.accent,
              }}>{pct === 100 ? 'Max' : `${pct}%`}</button>
            ))}
          </div>
        </div>

        {/* Leverage slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 9, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Leverage</label>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: leverageColor,
              padding: '1px 6px',
              borderRadius: 4,
              background: leverage >= 40 ? colors.negativeDim : leverage >= 20 ? colors.warningDim : colors.accentDim,
              ...typography.tabularNums,
            }}>{leverage}×</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={leverage}
            onChange={e => setLeverage(Number(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              appearance: 'none',
              background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(Math.min(leverage, 19) / 50) * 100}%, ${colors.warning} ${(19 / 50) * 100}%, ${colors.warning} ${(Math.min(leverage, 39) / 50) * 100}%, ${colors.negative} ${(39 / 50) * 100}%, ${colors.negative} 100%)`,
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 8, color: colors.textFaint }}>1×</span>
            <span style={{ fontSize: 8, color: colors.textFaint }}>50×</span>
          </div>
        </div>

        {/* TP/SL */}
        <div>
          <button onClick={() => setShowTpSl(!showTpSl)} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '6px 0',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: typography.fontFamily,
            fontSize: 10,
            fontWeight: 600,
            color: colors.textSecondary,
          }}>
            <span>Take Profit / Stop Loss</span>
            <span style={{ fontSize: 10, color: colors.textFaint, transform: showTpSl ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>▼</span>
          </button>
          {showTpSl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
              <div style={{ position: 'relative' }}>
                <input placeholder="Take Profit" value={tpPrice} onChange={e => setTpPrice(e.target.value)} style={{
                  width: '100%', height: 30, padding: '0 10px', border: `1px solid ${colors.borderFaint}`, borderRadius: 4,
                  fontSize: 10, fontFamily: typography.fontFamily, color: colors.textPrimary, background: colors.background, outline: 'none',
                }} />
              </div>
              <div style={{ position: 'relative' }}>
                <input placeholder="Stop Loss" value={slPrice} onChange={e => setSlPrice(e.target.value)} style={{
                  width: '100%', height: 30, padding: '0 10px', border: `1px solid ${colors.borderFaint}`, borderRadius: 4,
                  fontSize: 10, fontFamily: typography.fontFamily, color: colors.textPrimary, background: colors.background, outline: 'none',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{
          padding: '8px 0',
          borderTop: `1px solid ${colors.borderFaint}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: colors.textMuted }}>
            <span>Est. fee</span>
            <span style={{ ...typography.tabularNums }}>$13.45 (0.02%)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
            <span style={{ color: colors.textMuted }}>Liq. price</span>
            <span style={{ color: colors.negative, fontWeight: 600, ...typography.tabularNums }}>${liqPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
            <span style={{ color: colors.textMuted }}>Value</span>
            <span style={{ color: colors.textSecondary, ...typography.tabularNums }}>${usdValue}</span>
          </div>
        </div>

        {/* Place order button */}
        <button style={{
          height: 44,
          border: `1px solid ${sideMidColor}`,
          borderRadius: radii.button,
          background: sideDimColor,
          color: sideColor,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: typography.fontFamily,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          transition: 'all 150ms ease',
        }}>
          {isLong ? 'LONG' : 'SHORT'} BTC
        </button>

        {/* Market impact */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            background: colors.positiveDim,
            color: colors.positive,
          }}>Low impact</span>
          <span style={{ fontSize: 8, color: colors.textFaint, ...typography.tabularNums }}>+ ~$0.12 slippage</span>
        </div>
      </div>
    </div>
  );
});

export default TradePanel;
