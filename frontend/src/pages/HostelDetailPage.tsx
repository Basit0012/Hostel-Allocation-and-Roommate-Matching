import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calculator, Compass, Layers, LayoutGrid, Snowflake, Wind } from 'lucide-react';
import { hostelsApi } from '../api/hostelsApi';
import { FloorRoomDetail, HostelDetail } from '../types/hostel';
import { Spinner } from '../components/common/Spinner';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { RippleOverlay, useM3Ripple } from '../components/common/Ripple';
import { BedIndicator } from '../components/hostel/BedIndicator';
import { ArchitecturalFloorPlan } from '../components/hostel/ArchitecturalFloorPlan';
import { RoomInspectionModal } from '../components/hostel/RoomInspectionModal';
import { EconomicsCalculatorModal } from '../components/economics/EconomicsCalculatorModal';

export const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<HostelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBlockIdx, setSelectedBlockIdx] = useState(0);
  const [selectedFloorIdx, setSelectedFloorIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'BLUEPRINT' | 'GRID'>('BLUEPRINT');
  const [inspectedRoom, setInspectedRoom] = useState<FloorRoomDetail | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const { ripples, triggerRipple } = useM3Ripple();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setSelectedBlockIdx(0);
    setSelectedFloorIdx(0);
    hostelsApi
      .getHostelDetail(Number(id))
      .then((data) => {
        setHostel(data.hostel);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load hostel details.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner label="Loading tower blueprint and room matrix..." />;
  if (error || !hostel) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <Card variant="outlined" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h2 className="m3-headline-small" style={{ color: 'var(--status-danger)', margin: '0 0 0.5rem' }}>
            Hostel Complex Not Found
          </h2>
          <p className="m3-body-medium" style={{ color: 'var(--on-surface-variant)', margin: '0 0 1.5rem' }}>
            {error}
          </p>
          <Link to="/hostels" style={{ textDecoration: 'none' }}>
            <Button variant="tonal">
              <ArrowLeft size={16} /> Back to Hostels Directory
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const activeBlock = hostel.blocks[selectedBlockIdx] || hostel.blocks[0];
  const activeFloor = activeBlock?.floors[selectedFloorIdx] || activeBlock?.floors[0];
  const occupancyPct = hostel.total_beds > 0 ? Math.round((hostel.occupied_beds / hostel.total_beds) * 100) : 0;

  return (
    <div className="container">
      {/* Breadcrumb Back Navigation */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/hostels"
          className="m3-label-large"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none',
            color: 'var(--primary)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
          }}
        >
          <ArrowLeft size={15} />
          Back to Hostels Directory
        </Link>
      </div>

      {/* Tower Tonal Hero Banner */}
      <section className="m3-tonal-banner">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="m3-eyebrow-pill">
                <Building2 size={13} />
                {hostel.code}
              </span>
              <Badge variant={hostel.gender_policy === 'FEMALE' ? 'warning' : 'info'} size="sm">
                {hostel.gender_policy_display}
              </Badge>
              <Badge variant={hostel.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                {hostel.status_display}
              </Badge>
            </div>

            <h1 className="m3-headline-large" style={{ margin: '0 0 0.45rem', color: 'var(--on-surface)' }}>
              {hostel.name}
            </h1>
            <p className="m3-body-large" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '64ch' }}>
              {hostel.description}
            </p>
          </div>

          <div
            style={{
              minWidth: '250px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--outline-variant)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              padding: '1rem 1.2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div>
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Total
                </div>
                <div className="m3-title-large tabular-nums" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                  {hostel.total_beds}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--outline-variant)', borderRight: '1px solid var(--outline-variant)' }}>
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Vacant
                </div>
                <div className="m3-title-large tabular-nums" style={{ fontWeight: 700, color: hostel.vacant_beds > 0 ? 'var(--status-success)' : 'var(--status-danger)' }}>
                  {hostel.vacant_beds}
                </div>
              </div>
              <div>
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Filled
                </div>
                <div className="m3-title-large tabular-nums" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                  {hostel.occupied_beds}
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.28rem' }}>
                <span style={{ color: 'var(--on-surface-variant)' }}>Tower Occupancy</span>
                <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>{occupancyPct}%</span>
              </div>
              <div className="m3-progress-track">
                <div
                  className="m3-progress-fill"
                  style={{
                    width: `${Math.max(occupancyPct > 0 ? 4 : 0, occupancyPct)}%`,
                    backgroundColor: occupancyPct > 90 ? 'var(--md-sys-color-warning)' : 'var(--primary)',
                  }}
                />
              </div>
            </div>

            <Button type="button" variant="tonal" size="sm" style={{ width: '100%' }} onClick={() => setIsCalcOpen(true)}>
              <Calculator size={15} />
              Fee &amp; EDB Simulator
            </Button>
          </div>
        </div>
      </section>

      {/* Block / Floor Navigation & View Switcher */}
      {hostel.blocks.length > 0 ? (
        <div>
          <Card variant="outlined" style={{ marginBottom: '1.5rem', padding: '1.1rem 1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              {/* Wing & Floor Chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                  <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)', marginRight: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Building2 size={14} /> Block:
                  </span>
                  {hostel.blocks.map((block, idx) => {
                    const isActive = idx === selectedBlockIdx;
                    return (
                      <button
                        key={block.id}
                        type="button"
                        className={`m3-chip ${isActive ? 'is-active' : ''}`}
                        onPointerDown={triggerRipple}
                        onClick={() => {
                          setSelectedBlockIdx(idx);
                          setSelectedFloorIdx(0);
                        }}
                      >
                        <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
                        <span style={{ position: 'relative', zIndex: 1 }}>{block.name}</span>
                      </button>
                    );
                  })}
                </div>

                {activeBlock && activeBlock.floors.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                    <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)', marginRight: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Layers size={14} /> Level:
                    </span>
                    {activeBlock.floors.map((floor, idx) => {
                      const isActive = idx === selectedFloorIdx;
                      return (
                        <button
                          key={floor.id}
                          type="button"
                          className={`m3-chip ${isActive ? 'is-active' : ''}`}
                          onPointerDown={triggerRipple}
                          onClick={() => setSelectedFloorIdx(idx)}
                        >
                          <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
                          <span style={{ position: 'relative', zIndex: 1 }}>{floor.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Segmented CAD / Grid View Toggle */}
              <div className="m3-segmented">
                <button
                  type="button"
                  className={`m3-segmented-btn ${viewMode === 'BLUEPRINT' ? 'is-active' : ''}`}
                  onPointerDown={triggerRipple}
                  onClick={() => setViewMode('BLUEPRINT')}
                >
                  <RippleOverlay
                    ripples={ripples}
                    color={viewMode === 'BLUEPRINT' ? 'var(--md-sys-ripple-on-primary)' : 'var(--md-sys-ripple-color)'}
                  />
                  <Compass size={15} />
                  <span style={{ position: 'relative', zIndex: 1 }}>CAD Blueprint</span>
                </button>
                <button
                  type="button"
                  className={`m3-segmented-btn ${viewMode === 'GRID' ? 'is-active' : ''}`}
                  onPointerDown={triggerRipple}
                  onClick={() => setViewMode('GRID')}
                >
                  <RippleOverlay
                    ripples={ripples}
                    color={viewMode === 'GRID' ? 'var(--md-sys-ripple-on-primary)' : 'var(--md-sys-ripple-color)'}
                  />
                  <LayoutGrid size={15} />
                  <span style={{ position: 'relative', zIndex: 1 }}>Room Grid</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Floor Canvas or Room Grid */}
          {activeFloor && activeFloor.rooms.length > 0 ? (
            viewMode === 'BLUEPRINT' ? (
              <ArchitecturalFloorPlan
                floorLabel={activeFloor.label}
                blockName={activeBlock.name}
                rooms={activeFloor.rooms}
                onSelectRoom={(room) => setInspectedRoom(room)}
                selectedRoomId={inspectedRoom?.id}
              />
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <h2 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)' }}>
                    {activeBlock.name} · {activeFloor.label} Rooms
                  </h2>
                  <span className="m3-label-medium tabular-nums" style={{ color: 'var(--on-surface-variant)' }}>
                    {activeFloor.rooms.length} rooms listed
                  </span>
                </div>

                <div className="m3-catalog-grid">
                  {activeFloor.rooms.map((r) => (
                    <Card
                      key={r.id}
                      hoverable
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.9rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <Badge variant="neutral" size="sm">{r.capacity}-Seater</Badge>
                            <Badge variant={r.is_air_conditioned ? 'info' : 'neutral'} size="sm">
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                {r.is_air_conditioned ? <Snowflake size={11} /> : <Wind size={11} />}
                                {r.is_air_conditioned ? 'AC' : 'Cooler'}
                              </span>
                            </Badge>
                          </div>
                          <Badge variant={r.vacant_beds_count > 0 ? 'success' : 'warning'} size="sm">
                            {r.vacant_beds_count > 0 ? `${r.vacant_beds_count} Vacant` : 'Full'}
                          </Badge>
                        </div>

                        <h3 className="m3-title-large" style={{ margin: '0 0 0.2rem', color: 'var(--on-surface)' }}>
                          Room {r.room_number}
                        </h3>
                        <p className="m3-body-small" style={{ margin: '0 0 0.85rem', color: 'var(--on-surface-variant)' }}>
                          {r.category_display} · {r.washroom_type === 'ATTACHED' ? 'Attached Bath' : 'Shared Wing Bath'}
                          {r.quota_kwh ? ` · ${r.quota_kwh} kWh Quota` : ''}
                        </p>

                        <div
                          style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--md-sys-shape-corner-medium)',
                            backgroundColor: 'var(--surface-container-low)',
                            border: '1px solid var(--outline-variant)',
                          }}
                        >
                          <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                            Beds
                          </div>
                          <BedIndicator beds={r.beds} />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '0.65rem',
                          borderTop: '1px solid var(--outline-variant)',
                        }}
                      >
                        <div>
                          {r.standard_fee && (
                            <>
                              <div className="m3-title-medium tabular-nums" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                                ₹{r.standard_fee.toLocaleString('en-IN')}
                              </div>
                              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)' }}>
                                10-mo standard
                              </div>
                            </>
                          )}
                        </div>

                        <Button
                          variant={r.vacant_beds_count > 0 ? 'primary' : 'secondary'}
                          size="sm"
                          disabled={r.vacant_beds_count === 0}
                          onClick={() => setInspectedRoom(r)}
                        >
                          {r.vacant_beds_count > 0 ? 'Inspect & Select' : 'Fully Occupied'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ) : (
            <Card variant="outlined" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
              No rooms configured on this floor.
            </Card>
          )}
        </div>
      ) : (
        <Card variant="outlined" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
          No residential blocks configured for this hostel complex.
        </Card>
      )}

      <RoomInspectionModal
        room={inspectedRoom}
        hostelName={hostel.name}
        blockName={activeBlock?.name || ''}
        floorLabel={activeFloor?.label || ''}
        onClose={() => setInspectedRoom(null)}
      />

      <EconomicsCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
