import React, { memo } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { colors, typography } from '@/styles/tokens';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = memo(function AppLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      fontFamily: typography.fontFamily,
    }}>
      <Sidebar />
      <Topbar />
      <main style={{
        marginLeft: 220,
        paddingTop: 52,
        minHeight: '100vh',
      }}>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </main>
    </div>
  );
});

export default AppLayout;
