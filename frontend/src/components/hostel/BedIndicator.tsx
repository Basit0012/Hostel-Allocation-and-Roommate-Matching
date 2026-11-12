import React from 'react';
import { BedDetail } from '../../types/hostel';

export const BedIndicator: React.FC<{ beds: BedDetail[] }> = ({ beds }) => {
  return (
    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
      {beds.map((b) => {
        const isVacant = b.status === 'VACANT';
        return (
          <span
            key={b.id}
            title={`Bed ${b.identifier}: ${b.status_display}`}
            className="tabular-nums"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.85rem',
              height: '1.85rem',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              backgroundColor: isVacant ? 'var(--status-success-bg)' : 'var(--status-waitlisted-bg)',
              color: isVacant ? 'var(--md-sys-color-on-success-container)' : 'var(--status-waitlisted)',
              border: '1px solid var(--outline-variant)',
            }}
          >
            {b.identifier}
          </span>
        );
      })}
    </div>
  );
};
