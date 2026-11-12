import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizePx = size === 'sm' ? '1.35rem' : size === 'lg' ? '2.75rem' : '2rem';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        padding: '2.5rem',
      }}
    >
      <div
        style={{
          width: sizePx,
          height: sizePx,
          border: '3px solid var(--primary-container)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.75s var(--md-sys-motion-easing-standard) infinite',
        }}
      />
      {label && (
        <span className="m3-body-medium" style={{ color: 'var(--on-surface-variant)' }}>
          {label}
        </span>
      )}
    </div>
  );
};
