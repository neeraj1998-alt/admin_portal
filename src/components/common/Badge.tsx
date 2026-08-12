import React from 'react';
import type { WPPostStatus } from '../../types/database';

export interface BadgeProps {
  status?: WPPostStatus | string;
  variant?: 'published' | 'draft' | 'inherit' | 'closed' | 'neutral';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, children }) => {
  let badgeBg = '#f1f5f9';
  let badgeText = '#475569';
  let label = children || status;

  const activeVariant = variant || (status ? (status as string) : 'neutral');

  switch (activeVariant) {
    case 'publish':
    case 'published':
      badgeBg = 'var(--status-published-bg)';
      badgeText = 'var(--status-published-text)';
      label = label || 'Published';
      break;
    case 'draft':
      badgeBg = 'var(--status-draft-bg)';
      badgeText = 'var(--status-draft-text)';
      label = label || 'Draft';
      break;
    case 'inherit':
      badgeBg = 'var(--status-inherit-bg)';
      badgeText = 'var(--status-inherit-text)';
      label = label || 'Submitted';
      break;
    case 'closed':
      badgeBg = 'var(--status-closed-bg)';
      badgeText = 'var(--status-closed-text)';
      label = label || 'Closed';
      break;
    default:
      badgeBg = '#f1f5f9';
      badgeText = '#475569';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: badgeBg,
        color: badgeText,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
};
