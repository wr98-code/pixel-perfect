import React, { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { colors, typography } from '@/styles/tokens';

interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

interface Trade {
  time: number;
  price: number;
  size: number;
  isBuy: boolean;
}

function generateOrderBook(): { asks: OrderLevel[]; bids: OrderLevel[] } {
  const mid = 67234.52;
  const asks: OrderLevel[] = [];
  const bids: OrderLevel[] = [];
  let askTotal = 0;
  let bidTotal = 0;

  for (let i = 0; i < 15; i++) {
    const askSize = 0.1 + Math.random() * 3;
    askTotal += askSize;
    asks.push({ price: mid + (i + 1) * 0.5 + Math.random() * 2, size: askSize, total: askTotal });

    const bidSize = 0.1 + Math.random() * 3;
    bidTotal += bidSize;
    bids.push({ price: mid - (i + 1) * 0.5 - Math.random() * 2, size: bidSize, total: bidTotal });
  }

  return { asks: asks.reverse(), bids };
}

function generateTrades(): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    trades.push({
      time: now - i * 2000 - Math.random() * 5000,
      price: 67234.52 + (Math.random() - 0.5) * 20,
      size: 0.01 + Math.random() * 2,
      isBuy: Math.random() > 0.45,
    });
  }
  return trades;
}

const precisions = [0.1, 1, 10, 100];

const OrderBookPanel: React.FC = memo(function OrderBookPanel() {
  const [tab, setTab] = useState<'book' | 'trades'>('book');
  const [precision, setPrecision] = useState(1);

  const { asks, bids } = useMemo(() => generateOrderBook(), []);
  const trades = useMemo(() => generateTrades(), []);
  const maxTotal = useMemo(() => Math.max(asks[0]?.total || 0, bids[bids.length - 1]?.total || 0), [asks, bids]);
  const spread = useMemo(() => {
    if (bids.length && asks.length) {
      const s = asks[asks.length - 1].price - bids[0].price;
      return { value: s, pct: (s / bids[0].price) * 100 };
    }
    return { value: 0, pct: 0 };
  }, [asks, bids]);

  return (
    <div style={{
      width: 240,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${colors.borderFaint}`,
      fontFamily: typography.fontFamily,
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        borderBottom: `1px solid ${colors.borderFaint}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {(['book', 'trades'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '2px 8px',
              fontSize: 10,
              fontWeight: 600,
              fontFamily: typography.fontFamily,
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              background: tab === t ? colors.accentDim : 'transparent',
              color: tab === t ? colors.accent : colors.textMuted,
              textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>
        {tab === 'book' && (
          <div style={{ display: 'flex', gap: 2 }}>
            {precisions.map(p => (
              <button key={p} onClick={() => setPrecision(p)} style={{
                padding: '1px 5px',
                fontSize: 8,
                fontWeight: 600,
                fontFamily: typography.fontFamily,
                border: `1px solid ${precision === p ? colors.borderAccent : colors.borderFaint}`,
                borderRadius: 3,
                cursor: 'pointer',
                background: precision === p ? colors.accentDim : 'transparent',
                color: precision === p ? colors.accent : colors.textFaint,
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {tab === 'book' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            padding: '4px 8px',
            fontSize: 8,
            fontWeight: 600,
            color: colors.textFaint,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            <span>Price</span>
            <span style={{ textAlign: 'right' }}>Size</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </div>

          {/* Asks */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {asks.map((level, i) => (
              <OrderRow key={`a-${i}`} level={level} maxTotal={maxTotal} side="ask" />
            ))}
          </div>

          {/* Spread */}
          <div style={{
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.cardHover,
            fontSize: 9,
            color: colors.textMuted,
            fontWeight: 500,
            ...typography.tabularNums,
            flexShrink: 0,
          }}>
            Spread ${spread.value.toFixed(2)} ({spread.pct.toFixed(3)}%)
          </div>

          {/* Bids */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {bids.map((level, i) => (
              <OrderRow key={`b-${i}`} level={level} maxTotal={maxTotal} side="bid" />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 1fr 16px',
            padding: '4px 8px',
            fontSize: 8,
            fontWeight: 600,
            color: colors.textFaint,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            <span>Time</span>
            <span style={{ textAlign: 'right' }}>Price</span>
            <span style={{ textAlign: 'right' }}>Size</span>
            <span></span>
          </div>
          {trades.map((t, i) => (
            <TradeRow key={i} trade={t} />
          ))}
        </div>
      )}
    </div>
  );
});

const OrderRow: React.FC<{ level: OrderLevel; maxTotal: number; side: 'ask' | 'bid' }> = memo(function OrderRow({ level, maxTotal, side }) {
  const [hovered, setHovered] = useState(false);
  const depthPct = (level.total / maxTotal) * 100;
  const isAsk = side === 'ask';
  const barColor = isAsk ? 'rgba(210,40,80,0.06)' : 'rgba(0,160,100,0.06)';
  const priceColor = isAsk ? colors.negative : colors.positive;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: '0 8px',
        height: 22,
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        background: hovered ? colors.cardHover : 'transparent',
        transition: 'background 80ms',
      }}
    >
      {/* Depth bar */}
      <div style={{
        position: 'absolute',
        [isAsk ? 'right' : 'left']: 0,
        top: 0,
        bottom: 0,
        width: `${depthPct}%`,
        background: barColor,
        transition: 'width 150ms ease',
      }} />
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: priceColor,
        ...typography.tabularNums,
        position: 'relative',
        zIndex: 1,
      }}>{level.price.toFixed(2)}</span>
      <span style={{
        fontSize: 10,
        color: colors.textSecondary,
        ...typography.tabularNums,
        textAlign: 'right',
        position: 'relative',
        zIndex: 1,
      }}>{level.size.toFixed(3)}</span>
      <span style={{
        fontSize: 10,
        color: colors.textMuted,
        ...typography.tabularNums,
        textAlign: 'right',
        position: 'relative',
        zIndex: 1,
      }}>{level.total.toFixed(3)}</span>
    </div>
  );
});

const TradeRow: React.FC<{ trade: Trade }> = memo(function TradeRow({ trade }) {
  const isLarge = trade.size * trade.price > 100000;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '60px 1fr 1fr 16px',
      padding: '0 8px',
      height: 22,
      alignItems: 'center',
      background: isLarge ? 'rgba(15,40,180,0.03)' : 'transparent',
    }}>
      <span style={{ fontSize: 9, color: colors.textFaint, ...typography.tabularNums }}>
        {new Date(trade.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </span>
      <span style={{
        fontSize: 10,
        fontWeight: isLarge ? 700 : 600,
        color: trade.isBuy ? colors.positive : colors.negative,
        ...typography.tabularNums,
        textAlign: 'right',
      }}>{trade.price.toFixed(2)}</span>
      <span style={{
        fontSize: 10,
        color: colors.textSecondary,
        fontWeight: isLarge ? 600 : 400,
        ...typography.tabularNums,
        textAlign: 'right',
      }}>{trade.size.toFixed(4)}</span>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: trade.isBuy ? colors.positive : colors.negative,
        margin: '0 auto',
      }} />
    </div>
  );
});

export default OrderBookPanel;
