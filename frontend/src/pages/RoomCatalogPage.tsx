import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BedDouble, Check, RotateCcw, Search, SlidersHorizontal, Snowflake } from 'lucide-react';
import { hostelsApi } from '../api/hostelsApi';
import { HostelSummary } from '../types/hostel';
import { RoomFilterState, RoomSummary } from '../types/room';
import { RoomCard } from '../components/hostel/RoomCard';
import { Spinner } from '../components/common/Spinner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RippleOverlay, useM3Ripple } from '../components/common/Ripple';

export const RoomCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ripples, triggerRipple } = useM3Ripple();

  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState<RoomFilterState>(() => ({
    hostel_id: searchParams.get('hostel_id') || '',
    gender: searchParams.get('gender') || '',
    seater: searchParams.get('seater') || '',
    cooling: searchParams.get('cooling') || '',
    category: searchParams.get('category') || '',
    washroom_type: searchParams.get('washroom_type') || '',
    vacant_only: searchParams.get('vacant_only') === 'true',
    search: searchParams.get('q') || '',
  }));

  useEffect(() => {
    hostelsApi
      .getHostels()
      .then((res) => setHostels(res.hostels))
      .catch(() => {});
  }, []);

  const prevSearchRef = useRef(filters.search);

  useEffect(() => {
    const controller = new AbortController();
    const searchChanged = prevSearchRef.current !== filters.search;
    prevSearchRef.current = filters.search;
    const delayMs = searchChanged ? 200 : 0;

    setIsLoading(true);
    const timer = window.setTimeout(() => {
      hostelsApi
        .getRooms(filters, controller.signal)
        .then((res) => {
          if (controller.signal.aborted) return;
          setRooms(res.rooms);
          setError('');
        })
        .catch((err) => {
          if (controller.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
          setError(err instanceof Error ? err.message : 'Failed to load campus room catalog.');
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const handleFilterChange = <K extends keyof RoomFilterState>(key: K, value: RoomFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      hostel_id: '',
      gender: '',
      seater: '',
      cooling: '',
      category: '',
      washroom_type: '',
      vacant_only: false,
      search: '',
    });
  };

  const handleSelectRoom = (room: RoomSummary) => {
    navigate(`/apply?hostel=${room.hostel_id}&room=${room.id}`);
  };

  const toggleSeaterChip = (seater: string) => {
    handleFilterChange('seater', filters.seater === seater ? '' : seater);
  };

  const toggleCoolingChip = (cooling: string) => {
    handleFilterChange('cooling', filters.cooling === cooling ? '' : cooling);
  };

  const hasActiveFilters = Boolean(
    filters.hostel_id ||
      filters.gender ||
      filters.seater ||
      filters.cooling ||
      filters.category ||
      filters.washroom_type ||
      filters.vacant_only ||
      filters.search,
  );

  return (
    <div className="container">
      {/* Tonal Header Banner */}
      <section className="m3-tonal-banner">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="m3-eyebrow-pill" style={{ marginBottom: '0.75rem' }}>
              <BedDouble size={13} />
              Live Room &amp; Quota Catalog
            </span>
            <h1 className="m3-headline-medium" style={{ margin: '0.25rem 0 0.4rem', color: 'var(--on-surface)' }}>
              Filter Campus Room Inventory
            </h1>
            <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '62ch' }}>
              Compare standard vs. Early Decision Benefit tariffs, metered electricity allowances, washroom configurations, and real-time vacant beds before selecting your Choice #1 room.
            </p>
          </div>

          {!isLoading && !error && (
            <div
              style={{
                padding: '0.75rem 1.2rem',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--outline-variant)',
                textAlign: 'right',
              }}
            >
              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                Matching Rooms
              </div>
              <div className="m3-title-large tabular-nums" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {rooms.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Expressive M3 Quick Filter Chips + Detailed Matrix */}
      <Card variant="outlined" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        {/* Quick Filter Chips Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.6rem',
            paddingBottom: '1rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--outline-variant)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="m3-label-medium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--on-surface-variant)', marginRight: '0.25rem' }}>
              <SlidersHorizontal size={14} /> Quick Presets:
            </span>

            <button
              type="button"
              className={`m3-chip ${filters.vacant_only ? 'is-active' : ''}`}
              onPointerDown={triggerRipple}
              onClick={() => handleFilterChange('vacant_only', !filters.vacant_only)}
            >
              <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
              {filters.vacant_only && <Check size={14} />}
              <span>Vacant Only</span>
            </button>

            <button
              type="button"
              className={`m3-chip ${filters.cooling === 'AC' ? 'is-active' : ''}`}
              onPointerDown={triggerRipple}
              onClick={() => toggleCoolingChip('AC')}
            >
              <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
              <Snowflake size={14} />
              <span>AC Only</span>
            </button>

            <button
              type="button"
              className={`m3-chip ${filters.seater === '1' ? 'is-active' : ''}`}
              onPointerDown={triggerRipple}
              onClick={() => toggleSeaterChip('1')}
            >
              <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
              <span>1-Seater Studio</span>
            </button>

            <button
              type="button"
              className={`m3-chip ${filters.seater === '2' ? 'is-active' : ''}`}
              onPointerDown={triggerRipple}
              onClick={() => toggleSeaterChip('2')}
            >
              <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
              <span>2-Seater</span>
            </button>

            <button
              type="button"
              className={`m3-chip ${filters.seater === '4' ? 'is-active' : ''}`}
              onPointerDown={triggerRipple}
              onClick={() => toggleSeaterChip('4')}
            >
              <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
              <span>4-Seater</span>
            </button>
          </div>

          {hasActiveFilters && (
            <Button variant="text" size="sm" onClick={handleResetFilters}>
              <RotateCcw size={14} />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Structured Attribute Filter Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: '0.85rem',
            marginBottom: '0.9rem',
          }}
        >
          <div>
            <label htmlFor="filter-hostel" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Hostel Complex
            </label>
            <select
              id="filter-hostel"
              name="hostel_id"
              className="m3-field-control"
              value={filters.hostel_id}
              onChange={(e) => handleFilterChange('hostel_id', e.target.value)}
            >
              <option value="">All 14 Hostels</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.code} · {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-gender" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Gender Policy
            </label>
            <select
              id="filter-gender"
              name="gender"
              className="m3-field-control"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option value="">All Wings</option>
              <option value="MALE">Boys Hostels</option>
              <option value="FEMALE">Girls Hostels</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-seater" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Seater Capacity
            </label>
            <select
              id="filter-seater"
              name="seater"
              className="m3-field-control"
              value={filters.seater}
              onChange={(e) => handleFilterChange('seater', e.target.value)}
            >
              <option value="">All Capacities</option>
              <option value="1">1-Seater</option>
              <option value="2">2-Seater</option>
              <option value="3">3-Seater</option>
              <option value="4">4-Seater</option>
              <option value="6">6-Seater Dorm</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-cooling" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Cooling System
            </label>
            <select
              id="filter-cooling"
              name="cooling"
              className="m3-field-control"
              value={filters.cooling}
              onChange={(e) => handleFilterChange('cooling', e.target.value)}
            >
              <option value="">Any Cooling</option>
              <option value="AC">Air Conditioned (AC)</option>
              <option value="COOLER">Air Cooled (Cooler)</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-category" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Category
            </label>
            <select
              id="filter-category"
              name="category"
              className="m3-field-control"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="STANDARD">Standard Room</option>
              <option value="STUDIO_APARTMENT">Studio Apartment</option>
              <option value="DORMITORY">Dormitory</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-washroom" className="m3-label-small" style={{ display: 'block', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Washroom
            </label>
            <select
              id="filter-washroom"
              name="washroom_type"
              className="m3-field-control"
              value={filters.washroom_type}
              onChange={(e) => handleFilterChange('washroom_type', e.target.value)}
            >
              <option value="">Any Type</option>
              <option value="ATTACHED">Attached</option>
              <option value="SHARED">Shared Wing</option>
            </select>
          </div>
        </div>

        <div className="m3-search-shell">
          <Search
            size={16}
            color="var(--on-surface-variant)"
            style={{ position: 'absolute', left: '0.95rem', pointerEvents: 'none' }}
          />
          <input
            id="filter-room-search"
            name="search"
            type="text"
            aria-label="Search by room number or hostel code"
            className="m3-search-input"
            placeholder="Search by room number (e.g., 101, 204) or hostel code..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </Card>

      {/* Catalog Grid */}
      {isLoading ? (
        <Spinner label="Filtering campus room inventory..." />
      ) : error ? (
        <Card variant="outlined" style={{ padding: '2rem', textAlign: 'center', color: 'var(--status-danger)' }}>
          {error}
        </Card>
      ) : rooms.length === 0 ? (
        <Card variant="outlined" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h3 className="m3-title-large" style={{ margin: '0 0 0.4rem', color: 'var(--on-surface)' }}>
            No Room Records Found
          </h3>
          <p className="m3-body-medium" style={{ margin: '0 0 1.25rem', color: 'var(--on-surface-variant)' }}>
            No room accommodations match the current filter selection.
          </p>
          <Button variant="tonal" size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </Card>
      ) : (
        <div className="m3-catalog-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onSelect={handleSelectRoom} />
          ))}
        </div>
      )}
    </div>
  );
};
