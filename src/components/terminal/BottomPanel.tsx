import React, { memo, useState, useMemo } from 'react';
import { colors, typography, shadows } from '@/styles/tokens';
import ChangeBadge from '@/components/shared/ChangeBadge';

interface Position {
  coin: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entry: number;
  mark: number;
  liqPrice: number;
  pnl: number;
  pnlPct: number;
}

const mockPositions: Position[] = [
  { coin: 'BTC', side: 'LONG', size: 0.5, entry: 65200, mark: 67234.52, liqPrice: 58400, pnl: 1017.26, pnlPct: 3.12 },
  { coin: 'ETH', side: 'SHORT', size: 5.2, entry: 3600, mark: 3521.87, liqPrice: 4100, pnl: 406.28, pnlPct: 2.17 },
  { coin: 'SOL', side: 'LONG', size: 50, entry: 168.20, mark: 178.43, liqPrice: 142.50, pnl: 511.50, pnlPct: 6.08 },
];

const mockOrders = [
  { coin: 'BTC', type: 'Limit', side: 'LONG' as const, price: 64000, size: 0.25, filled: 0, time: Date.now() - 3600000 },
  { coin: 'ETH', type: 'Stop', side: 'SHORT' as const, price: 3800, size: 3.0, filled: 0, time: Date.now() - 7200000 },
];

const tabs = ['Positions', 'Open Orders', 'Order History', 'Fills', 'Funding', 'Account'];

const BottomPanel: React.FC = memo(function BottomPanel() {
  const [activeTab, setActiveTab] = useState('Positions');

  return (
    <div style={{
      height: 220,
      borderTop: `1px solid ${colors.borderMuted}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: typography.fontFamily,
      flexShrink: 0,
      background: colors.background,
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 32,
        padding: '0 12px',
        gap: 0,
        borderBottom: `1px solid ${colors.borderFaint}`,
        flexShrink: 0,
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '0 12px',
            height: '100%',
            fontSize: 10,
            fontWeight: 600,
            fontFamily: typography.fontFamily,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: activeTab === t ? colors.textPrimary : colors.textMuted,
            borderBottom: activeTab === t ? `2px solid ${colors.accent}` : '2px solid transparent',
            transition: 'all 150ms ease',
          }}>{t}{t === 'Positions' && ` (${mockPositions.length})`}{t === 'Open Orders' && ` (${mockOrders.length})`}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'Positions' && <PositionsTable />}
        {activeTab === 'Open Orders' && <OpenOrdersTable />}
        {activeTab === 'Account' && <AccountPanel />}
        {!['Positions', 'Open Orders', 'Account'].includes(activeTab) && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 6,
          }}>
            <span style={{ fontSize: 20, color: colors.textFaint }}>◇</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted }}>No data yet</span>
            <span style={{ fontSize: 9, color: colors.textFaint }}>Your {activeTab.toLowerCase()} will appear here</span>
          </div>
        )}
      </div>
    </div>
  );
});

const PositionsTable: React.FC = memo(function PositionsTable() {
  const cols = ['Coin', 'Side', 'Size', 'Entry', 'Mark', 'Liq Price', 'P&L', 'P&L%', 'Actions'];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 60px 70px 90px 90px 90px 90px 70px 1fr',
        padding: '4px 12px',
        fontSize: 9,
        fontWeight: 600,
        color: colors.textFaint,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {cols.map(c => <span key={c}>{c}</span>)}
      </div>
      {mockPositions.map((pos, i) => (
        <PositionRow key={i} position={pos} />
      ))}
    </div>
  );
});

const PositionRow: React.FC<{ position: Position }> = memo(function PositionRow({ position }) {
  const [hovered, setHovered] = useState(false);
  const isLong = position.side === 'LONG';
  const isProfitable = position.pnl >= 0;
  const liqDistance = Math.abs(position.mark - position.liqPrice) / position.mark * 100;

  const liqColor = useMemo(() => {
    if (liqDistance > 20) return colors.textMuted;
    if (liqDistance > 10) return colors.warning;
    return colors.negative;
  }, [liqDistance]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 60px 70px 90px 90px 90px 90px 70px 1fr',
        padding: '0 12px',
        height: 36,
        alignItems: 'center',
        background: hovered ? colors.cardHover : 'transparent',
        transition: 'background 80ms',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>{position.coin}</span>
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        padding: '1px 6px',
        borderRadius: 4,
        display: 'inline-block',
        width: 'fit-content',
        background: isLong ? colors.positiveDim : colors.negativeDim,
        color: isLong ? colors.positive : colors.negative,
      }}>{position.side}</span>
      <span style={{ fontSize: 10, color: colors.textSecondary, ...typography.tabularNums }}>{position.size}</span>
      <span style={{ fontSize: 10, color: colors.textSecondary, ...typography.tabularNums }}>${position.entry.toLocaleString()}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: colors.textPrimary, ...typography.tabularNums }}>${position.mark.toLocaleString()}</span>
      <span style={{
        fontSize: 10,
        fontWeight: liqDistance < 10 ? 700 : 400,
        color: liqColor,
        ...typography.tabularNums,
        animation: liqDistance < 5 ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }}>${position.liqPrice.toLocaleString()}</span>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: isProfitable ? colors.positive : colors.negative,
        ...typography.tabularNums,
      }}>{isProfitable ? '+' : '\u2212'}${Math.abs(position.pnl).toFixed(2)}</span>
      <ChangeBadge value={position.pnlPct * (isProfitable ? 1 : -1)} />
      {hovered && (
        <div style={{ display: 'flex', gap: 4 }}>
          {['Close', 'TP/SL'].map(a => (
            <button key={a} style={{
              padding: '2px 8px',
              fontSize: 8,
              fontWeight: 600,
              fontFamily: typography.fontFamily,
              border: `1px solid ${colors.borderMuted}`,
              borderRadius: 4,
              cursor: 'pointer',
              background: colors.background,
              color: colors.textSecondary,
            }}>{a}</button>
          ))}
        </div>
      )}
    </div>
  );
});

const OpenOrdersTable: React.FC = memo(function OpenOrdersTable() {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 60px 60px 90px 70px 70px 60px',
        padding: '4px 12px',
        fontSize: 9,
        fontWeight: 600,
        color: colors.textFaint,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {['Coin', 'Type', 'Side', 'Price', 'Size', 'Time', ''].map(c => <span key={c}>{c}</span>)}
      </div>
      {mockOrders.map((order, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '60px 60px 60px 90px 70px 70px 60px',
          padding: '0 12px',
          height: 32,
          alignItems: 'center',
          borderBottom: `1px solid ${colors.borderFaint}`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: colors.textPrimary }}>{order.coin}</span>
          <span style={{ fontSize: 9, color: colors.textMuted }}>{order.type}</span>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            padding: '1px 6px',
            borderRadius: 4,
            display: 'inline-block',
            width: 'fit-content',
            background: order.side === 'LONG' ? colors.positiveDim : colors.negativeDim,
            color: order.side === 'LONG' ? colors.positive : colors.negative,
          }}>{order.side}</span>
          <span style={{ fontSize: 10, color: colors.textSecondary, ...typography.tabularNums }}>${order.price.toLocaleString()}</span>
          <span style={{ fontSize: 10, color: colors.textSecondary, ...typography.tabularNums }}>{order.size}</span>
          <span style={{ fontSize: 9, color: colors.textFaint }}>
            {new Date(order.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button style={{
            width: 20,
            height: 20,
            border: `1px solid ${colors.borderMuted}`,
            borderRadius: 4,
            background: 'transparent',
            color: colors.negative,
            fontSize: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }} aria-label="Cancel order">×</button>
        </div>
      ))}
    </div>
  );
});

const AccountPanel: React.FC = memo(function AccountPanel() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '16px 20px',
    }}>
      {[
        { label: 'Account Value', value: '$48,234.52' },
        { label: 'Available Margin', value: '$31,280.10' },
        { label: 'Used Margin', value: '$16,954.42' },
        { label: 'Margin Ratio', value: '35.2%' },
      ].map(m => (
        <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, ...typography.tabularNums }}>{m.value}</span>
        </div>
      ))}
      {/* Mini margin arc */}
      <div style={{ marginLeft: 'auto' }}>
        <svg width={60} height={40} viewBox="0 0 60 40">
          <path d="M 5 35 A 25 25 0 0 1 55 35" fill="none" stroke="rgba(15,40,100,0.06)" strokeWidth={4} strokeLinecap="round" />
          <path d="M 5 35 A 25 25 0 0 1 55 35" fill="none" stroke={colors.accent} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={`${35.2 / 100 * 78.5} 78.5`} />
        </svg>
      </div>
    </div>
  );
});

export default BottomPanel;
