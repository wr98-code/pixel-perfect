import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, typography, springs } from '@/styles/tokens';
import TerminalTopbar from '@/components/terminal/TerminalTopbar';
import ChartPanel from '@/components/terminal/ChartPanel';
import OrderBookPanel from '@/components/terminal/OrderBookPanel';
import TradePanel from '@/components/terminal/TradePanel';
import BottomPanel from '@/components/terminal/BottomPanel';

const Terminal: React.FC = memo(function Terminal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 52px)',
        fontFamily: typography.fontFamily,
        margin: -20, // offset parent padding
        overflow: 'hidden',
      }}
    >
      <TerminalTopbar />

      {/* Main panels */}
      <div style={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
      }}>
        <ChartPanel />
        <OrderBookPanel />
        <TradePanel />
      </div>

      <BottomPanel />
    </motion.div>
  );
});

export default Terminal;
