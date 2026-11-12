import React from 'react';

export type CardVariant = 'elevated' | 'filled' | 'outlined' | 'tonal';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: CardVariant;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  onClick,
  hoverable = false,
  variant = 'outlined',
}) => {
  const isInteractive = Boolean(onClick || hoverable);

  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    elevated: {
      backgroundColor: 'var(--paper-surface)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'none',
    },
    filled: {
      backgroundColor: 'var(--paper-recessed)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
    tonal: {
      backgroundColor: 'var(--paper-recessed)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
    outlined: {
      backgroundColor: 'var(--paper-surface)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden',
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={`m3-surface-card card ${isInteractive ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};
