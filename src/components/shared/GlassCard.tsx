import React, { memo } from 'react';
import { colors, shadows, radii, typography } from '@/styles/tokens';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = memo(function GlassCard({ children, style, title, actions, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.card,
        border: `1px solid ${colors.borderMuted}`,
        borderRadius: radii.card,
        boxShadow: hovered ? shadows.elevated : shadows.card,
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: typography.fontFamily,
        ...style,
      }}
    >
      {title && (
        <div style={{
          height: 36,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${colors.borderFaint}`,
          marginBottom: 12,
          paddingBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 2,
              height: 20,
              background: 'rgba(15, 40, 180, 0.6)',
              borderRadius: 1,
            }} />
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily,
            }}>{title}</span>
          </div>
          {actions && <div style={{ display: 'flex', gap: 4 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
});

export default GlassCard;
