import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  style: customStyle,
}) => {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary-tint)',
      color: 'var(--primary-ink)',
      border: '1px solid var(--primary)',
    },
    success: {
      backgroundColor: 'var(--available-bg)',
      color: 'var(--available-ink)',
      border: '1px solid var(--available-border)',
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning-ink)',
      border: '1px solid var(--warning-border)',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger-ink)',
      border: '1px solid var(--danger-border)',
    },
    info: {
      backgroundColor: 'var(--paper-recessed)',
      color: 'var(--ink)',
      border: '1px solid var(--border-strong)',
    },
    neutral: {
      backgroundColor: 'var(--paper-recessed)',
      color: 'var(--ink-secondary)',
      border: '1px solid var(--border)',
    },
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
    padding: size === 'sm' ? '3px 8px' : '4px 10px',
    lineHeight: 1.25,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
    ...variantStyles[variant],
    ...customStyle,
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
