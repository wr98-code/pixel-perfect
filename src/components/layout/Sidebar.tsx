import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors, shadows, typography } from '@/styles/tokens';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'CORE',
    items: [
      { label: 'Dashboard', icon: '◫', path: '/' },
      { label: 'Markets', icon: '◉', path: '/markets' },
      { label: 'Charts', icon: '◈', path: '/charts' },
      { label: 'Order Book', icon: '▤', path: '/orderbook' },
    ],
  },
  {
    title: 'TRADING',
    items: [
      { label: 'Terminal', icon: '⊞', path: '/terminal' },
      { label: 'Alerts', icon: '◆', path: '/alerts' },
      { label: 'Watchlist', icon: '☆', path: '/watchlist' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'AI Signals', icon: '⚡', path: '/aisignals' },
      { label: 'News', icon: '◧', path: '/news' },
    ],
  },
  {
    title: 'ON-CHAIN',
    items: [
      { label: 'On-Chain', icon: '⬡', path: '/onchain' },
      { label: 'DeFi', icon: '◎', path: '/defi' },
    ],
  },
  {
    title: 'PORTFOLIO',
    items: [
      { label: 'Portfolio', icon: '◰', path: '/portfolio' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Settings', icon: '⚙', path: '/settings' },
    ],
  },
];

const Sidebar: React.FC = memo(function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleNav = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return (
    <nav style={{
      width: 220,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: colors.card,
      borderRight: `1px solid ${colors.borderFaint}`,
      boxShadow: shadows.sidebar,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      overflowY: 'auto',
      fontFamily: typography.fontFamily,
    }}>
      {/* Logo */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: `1px solid ${colors.borderFaint}`,
        gap: 8,
        flexShrink: 0,
      }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: colors.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,1)',
          fontSize: 12,
          fontWeight: 700,
        }}>Ø</div>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: colors.textPrimary,
          letterSpacing: '0.04em',
        }}>ZERØ MERIDIAN</span>
      </div>

      {/* Nav sections */}
      <div style={{ padding: '8px 0', flex: 1 }}>
        {navSections.map((section) => (
          <div key={section.title} style={{ marginBottom: 4 }}>
            <div style={{
              padding: '8px 16px 4px',
              fontSize: 9,
              fontWeight: 600,
              color: colors.textFaint,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontFamily: typography.fontFamily,
            }}>{section.title}</div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              const isHovered = hoveredPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  style={{
                    width: '100%',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0 16px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: typography.fontFamily,
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? colors.accent : isHovered ? colors.textPrimary : colors.textSecondary,
                    background: isActive ? colors.accentDim : isHovered ? 'rgba(15,40,100,0.06)' : 'transparent',
                    borderLeft: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
                    boxShadow: isActive ? 'inset 2px 0 8px rgba(15,40,180,0.08)' : 'none',
                    transform: isHovered && !isActive ? 'translateX(2px)' : 'translateX(0)',
                    transition: 'all 150ms ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 14,
                    width: 20,
                    textAlign: 'center',
                    color: isActive ? colors.accent : colors.textMuted,
                    transition: 'color 150ms ease',
                  }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
});

export default Sidebar;
