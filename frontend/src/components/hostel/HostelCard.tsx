import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Building2, Snowflake, Wind } from 'lucide-react';
import { HostelSummary } from '../../types/hostel';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface HostelCardProps {
  hostel: HostelSummary;
}

export const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  const isAvailable = hostel.status === 'ACTIVE' && hostel.vacant_beds > 0;
  const occPct = Math.min(100, Math.max(0, hostel.occupancy_pct));

  return (
    <Card
      hoverable
      style={{
        padding: '1.35rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.1rem',
        height: '100%',
      }}
    >
      <div>
        {/* Eyebrow & Status Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--primary-container)',
              color: 'var(--on-primary-container)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            <Building2 size={12} />
            {hostel.code}
          </span>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <Badge variant={hostel.gender_policy === 'FEMALE' ? 'warning' : 'info'} size="sm">
              {hostel.gender_policy_display}
            </Badge>
            <Badge variant={isAvailable ? 'success' : 'neutral'} size="sm">
              {isAvailable ? 'Accepting' : hostel.status_display}
            </Badge>
          </div>
        </div>

        {/* Tower Name & Description */}
        <h3
          className="m3-title-large"
          style={{
            margin: '0 0 0.35rem',
            color: 'var(--on-surface)',
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {hostel.name}
        </h3>

        <p
          className="m3-body-small"
          style={{
            margin: '0 0 1rem',
            color: 'var(--on-surface-variant)',
            lineHeight: 1.5,
            minHeight: '2.6rem',
          }}
        >
          {hostel.description}
        </p>

        {/* M3 Tonal Telemetry Strip */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              textAlign: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                Beds
              </div>
              <div className="m3-title-medium tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                {hostel.total_beds}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--outline-variant)', borderRight: '1px solid var(--outline-variant)' }}>
              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                Vacant
              </div>
              <div
                className="m3-title-medium tabular-nums"
                style={{
                  color: hostel.vacant_beds > 0 ? 'var(--status-success)' : 'var(--status-danger)',
                  fontWeight: 700,
                }}
              >
                {hostel.vacant_beds}
              </div>
            </div>
            <div>
              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                Rooms
              </div>
              <div className="m3-title-medium tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                {hostel.total_rooms}
              </div>
            </div>
          </div>

          {/* Occupancy Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.28rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Current Occupancy</span>
              <span className="tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>{occPct}%</span>
            </div>
            <div className="m3-progress-track">
              <div
                className="m3-progress-fill"
                style={{
                  width: `${Math.max(occPct > 0 ? 4 : 0, occPct)}%`,
                  backgroundColor: occPct > 90 ? 'var(--md-sys-color-warning)' : 'var(--primary)',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
              paddingTop: '0.55rem',
              borderTop: '1px solid var(--outline-variant)',
              fontSize: '0.75rem',
              color: 'var(--on-surface-variant)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Snowflake size={12} color="var(--primary)" /> {hostel.ac_rooms_count} AC
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Wind size={12} /> {hostel.cooler_rooms_count} Cooler
            </span>
          </div>
        </div>
      </div>

      {/* Footer Tariff & Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--outline-variant)',
        }}
      >
        <div>
          <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
            Standard From
          </div>
          <div className="m3-title-medium tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
            {hostel.min_standard_fee ? `₹${hostel.min_standard_fee.toLocaleString('en-IN')}` : 'Fee TBD'}
          </div>
        </div>

        <Link to={`/hostels/${hostel.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="tonal" size="sm">
            <BedDouble size={15} />
            Inspect Tower
            <ArrowRight size={15} />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
