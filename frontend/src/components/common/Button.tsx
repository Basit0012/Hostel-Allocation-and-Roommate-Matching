import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'filled'
  | 'secondary'
  | 'tonal'
  | 'elevated'
  | 'outline'
  | 'danger'
  | 'destructive'
  | 'ghost'
  | 'text';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  style,
  ...rest
}) => {
  const isDisabled = Boolean(disabled || isLoading);

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '8px 14px', fontSize: '0.8125rem', minHeight: '40px', borderRadius: 'var(--radius-md)' },
    md: { padding: '10px 18px', fontSize: '0.875rem', minHeight: '44px', borderRadius: 'var(--radius-md)' },
    lg: { padding: '10px 20px', fontSize: '0.9375rem', minHeight: '44px', borderRadius: 'var(--radius-md)' },
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--on-primary)',
      borderColor: 'var(--primary)',
    },
    filled: {
      backgroundColor: 'var(--primary)',
      color: 'var(--on-primary)',
      borderColor: 'var(--primary)',
    },
    secondary: {
      backgroundColor: 'var(--paper-surface)',
      color: 'var(--ink)',
      borderColor: 'var(--border-strong)',
    },
    tonal: {
      backgroundColor: 'var(--paper-recessed)',
      color: 'var(--ink)',
      borderColor: 'var(--border)',
    },
    elevated: {
      backgroundColor: 'var(--paper-surface)',
      color: 'var(--ink)',
      borderColor: 'var(--border-strong)',
    },
    outline: {
      backgroundColor: 'var(--paper-surface)',
      color: 'var(--ink)',
      borderColor: 'var(--border-strong)',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger-ink)',
      borderColor: 'var(--danger-border)',
    },
    destructive: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger-ink)',
      borderColor: 'var(--danger-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--ink-secondary)',
      borderColor: 'transparent',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--primary-ink)',
      borderColor: 'transparent',
    },
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.58 : 1,
    textDecoration: 'none',
    border: '1px solid var(--border)',
    letterSpacing: '0',
    whiteSpace: 'nowrap',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  return (
    <button
      disabled={isDisabled}
      style={baseStyle}
      className={`m3-btn btn ${className}`}
      {...rest}
    >
      {isLoading && (
        <span
          style={{
            width: '0.875rem',
            height: '0.875rem',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
        }}
      >
        {children}
      </span>
    </button>
  );
};
