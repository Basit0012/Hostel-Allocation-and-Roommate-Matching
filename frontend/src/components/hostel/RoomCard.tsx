import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Snowflake, Wind, Zap } from 'lucide-react';
import { RoomSummary } from '../../types/room';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { BedIndicator } from './BedIndicator';

interface RoomCardProps {
  room: RoomSummary;
  onSelect?: (room: RoomSummary) => void;
  isSelected?: boolean;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect, isSelected }) => {
  const hasVacancy = room.vacant_beds_count > 0;

  return (
    <Card
      hoverable
      style={{
        padding: '1.3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        height: '100%',
        borderColor: isSelected ? 'var(--primary)' : undefined,
        boxShadow: isSelected ? 'var(--md-sys-elevation-2)' : undefined,
      }}
    >
      <div>
        {/* Capability Badges Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <Badge variant="neutral" size="sm">
              {room.capacity}-Seater
            </Badge>
            <Badge variant={room.is_air_conditioned ? 'info' : 'neutral'} size="sm">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {room.is_air_conditioned ? <Snowflake size={11} /> : <Wind size={11} />}
                {room.is_air_conditioned ? 'AC' : 'Cooler'}
              </span>
            </Badge>
            <Badge variant="neutral" size="sm">
              {room.category_display}
            </Badge>
          </div>

          <Badge variant={hasVacancy ? 'success' : 'warning'} size="sm">
            {hasVacancy ? `${room.vacant_beds_count} Vacant` : 'Full'}
          </Badge>
        </div>

        {/* Room Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
          <h3 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)', fontWeight: 700 }}>
            Room {room.room_number}
          </h3>
          <span className="m3-label-small" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
            {room.hostel_code}
          </span>
        </div>

        <p className="m3-body-small" style={{ margin: '0.25rem 0 0.9rem', color: 'var(--on-surface-variant)' }}>
          {room.hostel_name} · {room.block_name} · Floor {room.floor_number}
        </p>

        {/* Tonal Specs & Bed Matrix Box */}
        <div
          style={{
            padding: '0.85rem 0.95rem',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.65rem',
              fontSize: '0.75rem',
              color: 'var(--on-surface-variant)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{room.washroom_type_display}</span>
            {room.quota_kwh && (
              <span className="tabular-nums" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                <Zap size={12} /> {room.quota_kwh} kWh Free
              </span>
            )}
          </div>

          <div style={{ marginBottom: '0.25rem' }}>
            <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Bed Matrix
            </div>
            <BedIndicator beds={room.beds} />
          </div>
        </div>
      </div>

      {/* Pricing & Primary Action Footer */}
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
          {room.standard_fee ? (
            <>
              <div className="m3-title-medium tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                ₹{room.standard_fee.toLocaleString('en-IN')}
              </div>
              {room.edb_fee && (
                <div className="m3-label-small tabular-nums" style={{ color: 'var(--status-success)', fontWeight: 700 }}>
                  EDB ₹{room.edb_fee.toLocaleString('en-IN')}
                </div>
              )}
            </>
          ) : (
            <span className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>Standard Tariff</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          <Link
            to={`/hostels/${room.hostel_id}`}
            className="m3-label-medium"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '0.35rem 0.55rem',
            }}
          >
            Floor
          </Link>
          <Button
            variant={isSelected ? 'tonal' : hasVacancy ? 'primary' : 'secondary'}
            size="sm"
            disabled={!hasVacancy}
            onClick={() => onSelect?.(room)}
          >
            {isSelected ? 'Selected' : hasVacancy ? 'Select Bed' : 'Full'}
            {hasVacancy && !isSelected && <ArrowRight size={14} />}
          </Button>
        </div>
      </div>
    </Card>
  );
};
