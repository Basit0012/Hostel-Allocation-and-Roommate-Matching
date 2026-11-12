import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { hostelsApi } from '../api/hostelsApi';
import { HostelSummary } from '../types/hostel';
import { HostelCard } from '../components/hostel/HostelCard';
import { Spinner } from '../components/common/Spinner';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RippleOverlay, useM3Ripple } from '../components/common/Ripple';

type GenderTab = 'ALL' | 'MALE' | 'FEMALE';
type SortKey = 'CODE' | 'VACANT' | 'FEE';

export const HostelsPage: React.FC = () => {
  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [genderFilter, setGenderFilter] = useState<GenderTab>('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('CODE');
  const { ripples, triggerRipple } = useM3Ripple();

  useEffect(() => {
    setIsLoading(true);
    hostelsApi
      .getHostels()
      .then((data) => {
        setHostels(data.hostels);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load residential hostels.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredHostels = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = hostels.filter((h) => {
      if (genderFilter !== 'ALL' && h.gender_policy !== genderFilter) return false;
      if (q) {
        return (
          h.name.toLowerCase().includes(q) ||
          h.code.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'VACANT') return b.vacant_beds - a.vacant_beds;
      if (sortBy === 'FEE') return (a.min_standard_fee ?? Infinity) - (b.min_standard_fee ?? Infinity);
      return a.code.localeCompare(b.code, undefined, { numeric: true });
    });
  }, [hostels, genderFilter, search, sortBy]);

  const totalVacant = useMemo(
    () => filteredHostels.reduce((acc, item) => acc + item.vacant_beds, 0),
    [filteredHostels],
  );

  return (
    <div className="container">
      {/* Tonal M3 Page Header */}
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
              <Building2 size={13} />
              Campus Housing Directory
            </span>
            <h1 className="m3-headline-medium" style={{ margin: '0.25rem 0 0.4rem', color: 'var(--on-surface)' }}>
              14 Residential Hostel Complexes
            </h1>
            <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '62ch' }}>
              Compare real-time bed vacancies, AC and Air-Cooled room availability, and tariff floors across all Boys (BH-1 to BH-8) and Girls (GH-1 to GH-6) campus towers.
            </p>
          </div>

          {!isLoading && !error && (
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                padding: '0.75rem 1.15rem',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--outline-variant)',
              }}
            >
              <div>
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Towers Shown
                </div>
                <div className="m3-title-large tabular-nums" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                  {filteredHostels.length}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--outline-variant)', paddingLeft: '1.25rem' }}>
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                  Open Beds
                </div>
                <div className="m3-title-large tabular-nums" style={{ color: 'var(--status-success)', fontWeight: 700 }}>
                  {totalVacant.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <Card variant="outlined" style={{ marginBottom: '1.5rem', padding: '0.95rem 1.1rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          {/* Segmented Wing Filter */}
          <div className="m3-segmented">
            {([
              { id: 'ALL', label: 'All Towers (14)' },
              { id: 'MALE', label: 'Boys (BH)' },
              { id: 'FEMALE', label: 'Girls (GH)' },
            ] as const).map((tab) => {
              const isActive = genderFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`m3-segmented-btn ${isActive ? 'is-active' : ''}`}
                  onPointerDown={triggerRipple}
                  onClick={() => setGenderFilter(tab.id)}
                >
                  <RippleOverlay
                    ripples={ripples}
                    color={isActive ? 'var(--md-sys-ripple-on-primary)' : 'var(--md-sys-ripple-color)'}
                  />
                  <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
            <div className="m3-search-shell" style={{ maxWidth: '340px' }}>
              <Search
                size={16}
                color="var(--on-surface-variant)"
                style={{ position: 'absolute', left: '0.95rem', pointerEvents: 'none' }}
              />
              <input
                type="text"
                className="m3-search-input"
                placeholder="Search BH-1, GH-3, studio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              aria-label="Sort Hostels"
              className="m3-field-control"
              style={{ width: 'auto', minWidth: '175px', borderRadius: 'var(--radius-pill)' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              <option value="CODE">Sort: Tower Code</option>
              <option value="VACANT">Sort: Most Vacant Beds</option>
              <option value="FEE">Sort: Lowest Fee First</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tower Results */}
      {isLoading ? (
        <Spinner label="Loading campus housing complexes..." />
      ) : error ? (
        <Card variant="outlined" style={{ padding: '2rem', textAlign: 'center', color: 'var(--status-danger)' }}>
          {error}
        </Card>
      ) : filteredHostels.length === 0 ? (
        <Card variant="outlined" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h3 className="m3-title-large" style={{ margin: '0 0 0.4rem', color: 'var(--on-surface)' }}>
            No Matching Hostel Towers
          </h3>
          <p className="m3-body-medium" style={{ margin: '0 0 1.25rem', color: 'var(--on-surface-variant)' }}>
            No residential tower matched your current search or gender wing filter.
          </p>
          <Button
            variant="tonal"
            size="sm"
            onClick={() => {
              setGenderFilter('ALL');
              setSearch('');
            }}
          >
            Reset Directory Filters
          </Button>
        </Card>
      ) : (
        <div className="m3-catalog-grid">
          {filteredHostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </div>
      )}
    </div>
  );
};
