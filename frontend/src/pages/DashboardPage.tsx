import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calculator,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationsApi } from '../api/applicationsApi';
import { DashboardSummary, HostelApplicationItem } from '../types/application';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { GatePassWidget } from '../components/living/GatePassWidget';
import { RMSDeskWidget } from '../components/living/RMSDeskWidget';
import { WardenCommandCenter } from '../components/warden/WardenCommandCenter';
import { EconomicsCalculatorModal } from '../components/economics/EconomicsCalculatorModal';
import { ContinuousTabs } from '../components/watermelon/ContinuousTabs';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [applications, setApplications] = useState<HostelApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appFilter, setAppFilter] = useState<'ALL' | 'ALLOCATED' | 'PENDING'>('ALL');
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      applicationsApi.getDashboardSummary(),
      user?.role === 'STUDENT'
        ? applicationsApi.getApplications().catch(() => ({ applications: [] }))
        : Promise.resolve({ applications: [] }),
    ])
      .then(([sumData, appData]) => {
        setSummary(sumData);
        setApplications(appData.applications);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.role]);

  if (isLoading) return <Spinner label="Loading residential dashboard..." />;

  // Render Warden & Administrator Command Center for staff accounts
  if (user && (user.role === 'WARDEN' || user.role === 'ADMIN')) {
    return (
      <div className="container">
        <WardenCommandCenter userEmail={user.email} role={user.role} />
      </div>
    );
  }

  const student = user?.student;
  const activeAllocation = student?.active_allocation;
  const campus = summary?.campus;

  const occupancyRate = campus?.occupancy_rate ?? 0;
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const clampedPct = Math.max(0, Math.min(100, occupancyRate));
  const ringOffset = ringCircumference - (clampedPct / 100) * ringCircumference;

  const latestApp = applications[0] ?? null;
  const filteredApplications = applications.filter((app) => {
    if (appFilter === 'ALLOCATED') return app.status === 'ALLOCATED';
    if (appFilter === 'PENDING') return app.status !== 'ALLOCATED';
    return true;
  });

  // Journey stepper stage (purely derived from real user/application data)
  const journeySteps = [
    { label: 'Registry Verified', done: Boolean(student) },
    { label: 'Roommates / Preferences', done: Boolean(applications.length > 0 || activeAllocation) },
    { label: 'Application Filed', done: applications.length > 0 },
    { label: 'Bed Allocated', done: Boolean(activeAllocation) },
  ];

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* ROW 1: Expressive Hero Bento Grid */}
      <section className="m3-grid">
        {/* Left: Primary Residence Status Card (7 cols desktop) */}
        <div
          className="m3-span-7"
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Badge variant="success" size="sm">
                <ShieldCheck size={12} />
                Active LPU Student
              </Badge>
              <Badge variant="info" size="sm">
                {campus?.active_cycle_name || 'Academic Session 2026-27'}
              </Badge>
            </div>

            <h1
              className="m3-display-small"
              style={{
                margin: '0 0 0.4rem',
                color: 'var(--on-primary-container)',
              }}
            >
              Welcome back, {student?.full_name || user?.email.split('@')[0]}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span
                className="m3-label-medium tabular-nums"
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--surface-container-lowest)',
                  color: 'var(--on-surface)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ID #{student?.student_id || user?.student_id_login || 'N/A'}
              </span>
              <span className="m3-body-medium" style={{ color: 'var(--on-primary-container)', opacity: 0.9 }}>
                {student?.branch || 'School of Computer Science & Engineering'}
              </span>
              {student?.gender_display && (
                <span className="m3-body-small" style={{ color: 'var(--on-primary-container)', opacity: 0.8 }}>
                  • {student.gender_display}
                </span>
              )}
            </div>
          </div>

          {/* Allocation Highlight OR Next-Step Callout */}
          {activeAllocation ? (
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                backgroundColor: 'var(--surface-container-lowest)',
                color: 'var(--on-surface)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: '1.15rem 1.25rem',
                border: '1px solid var(--outline-variant)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <Badge variant="success" size="sm">Confirmed Occupant</Badge>
                  <span className="m3-label-small tabular-nums" style={{ color: 'var(--on-surface-variant)' }}>
                    {activeAllocation.start_date} – {activeAllocation.end_date}
                  </span>
                </div>
                <div className="m3-title-large" style={{ color: 'var(--on-surface)', marginBottom: '0.2rem' }}>
                  {activeAllocation.hostel_name} ({activeAllocation.hostel_code})
                </div>
                <div className="m3-body-medium" style={{ color: 'var(--on-surface-variant)' }}>
                  Room <strong className="tabular-nums" style={{ color: 'var(--on-surface)' }}>{activeAllocation.room_number}</strong> • Bed{' '}
                  <strong className="tabular-nums" style={{ color: 'var(--on-surface)' }}>{activeAllocation.bed_identifier}</strong> •{' '}
                  <span className="tabular-nums">{activeAllocation.seater}</span>-Seater{' '}
                  {activeAllocation.cooling_type === 'AIR_CONDITIONED' ? 'AC' : 'Air-Cooled'}
                </div>
              </div>

              <Link to="/hostels">
                <Button variant="tonal" size="sm">
                  <Compass size={15} />
                  View Complex
                </Button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                backgroundColor: 'var(--surface-container-lowest)',
                color: 'var(--on-surface)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: '1.15rem 1.25rem',
                border: '1px solid var(--outline-variant)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="m3-title-small" style={{ color: 'var(--on-surface)' }}>
                  Allocation Journey · Unallocated
                </span>
                <Badge variant="warning" size="sm">Action Needed</Badge>
              </div>

              {/* 4-Step Material Progress Track */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.5rem' }}>
                {journeySteps.map((step, idx) => (
                  <div
                    key={step.label}
                    style={{
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--md-sys-shape-corner-medium)',
                      backgroundColor: step.done ? 'var(--md-sys-color-success-container)' : 'var(--surface-container-low)',
                      color: step.done ? 'var(--md-sys-color-on-success-container)' : 'var(--on-surface-variant)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <CheckCircle2 size={14} style={{ flexShrink: 0, opacity: step.done ? 1 : 0.45 }} />
                    <span className="m3-label-small" style={{ lineHeight: 1.2 }}>
                      {idx + 1}. {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
                <Link to="/apply">
                  <Button variant="primary" size="md">
                    Submit Room Preferences
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/roommates">
                  <Button variant="tonal" size="md">
                    Find Roommate First
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Campus Telemetry & Fee Simulator Card (5 cols desktop) */}
        <div
          className="m3-span-5"
          style={{
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            padding: '1.65rem',
            backgroundColor: 'var(--surface-container-high)',
            border: '1px solid var(--outline-variant)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div>
              <span className="m3-label-small" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Live Campus Telemetry
              </span>
              <h2 className="m3-title-large" style={{ margin: '0.2rem 0 0' }}>
                Housing Inventory
              </h2>
            </div>
            <Badge variant="primary" size="sm">
              {campus?.total_hostels ?? 14} Towers
            </Badge>
          </div>

          {/* Radial Occupancy Ring + Live Counts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '104px', height: '104px', flexShrink: 0 }}>
              <svg width="104" height="104" viewBox="0 0 104 104" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="52"
                  cy="52"
                  r={ringRadius}
                  fill="none"
                  stroke="var(--outline-variant)"
                  strokeWidth="10"
                />
                <circle
                  cx="52"
                  cy="52"
                  r={ringRadius}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 600ms var(--md-sys-motion-easing-emphasized-decelerate)' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="m3-title-medium tabular-nums" style={{ color: 'var(--on-surface)' }}>
                  {clampedPct.toFixed(1)}%
                </span>
                <span className="m3-label-small" style={{ color: 'var(--on-surface-variant)' }}>
                  Occupied
                </span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem', minWidth: '170px' }}>
              <div
                style={{
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  backgroundColor: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)' }}>Vacant Beds</div>
                <div className="m3-title-large tabular-nums" style={{ color: 'var(--md-sys-color-success)', marginTop: '2px' }}>
                  {(campus?.vacant_beds ?? 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div
                style={{
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  backgroundColor: 'var(--surface-container-lowest)',
                  border: '1px solid var(--outline-variant)',
                }}
              >
                <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)' }}>Total Rooms</div>
                <div className="m3-title-large tabular-nums" style={{ color: 'var(--on-surface)', marginTop: '2px' }}>
                  {(campus?.total_rooms ?? 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--outline-variant)' }}>
            <span className="m3-body-small">Compare 10-mo session fees, EDB &amp; kWh quotas</span>
            <Button variant="elevated" size="sm" onClick={() => setIsCalcOpen(true)}>
              <Calculator size={15} />
              Fee Simulator
            </Button>
          </div>
        </div>
      </section>

      {/* ROW 2: Expressive KPI & Service Rail (4 equal cards) */}
      <section className="m3-grid">
        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--primary-container)',
                color: 'var(--on-primary-container)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={20} />
            </span>
            <Badge variant="info" size="sm">Academic</Badge>
          </div>
          <div className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Academic CGPA</div>
          <div className="m3-headline-small tabular-nums" style={{ color: 'var(--on-surface)', margin: '0.2rem 0' }}>
            {student?.cgpa !== null && student?.cgpa !== undefined ? student.cgpa.toFixed(2) : 'On Record'}
          </div>
          <div className="m3-body-small" style={{ marginTop: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </Card>

        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--tertiary-container)',
                color: 'var(--on-tertiary-container)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </span>
            <Badge variant={latestApp?.status === 'ALLOCATED' ? 'success' : 'neutral'} size="sm">
              {latestApp ? latestApp.status_display : 'None Filed'}
            </Badge>
          </div>
          <div className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Session Applications</div>
          <div className="m3-headline-small tabular-nums" style={{ color: 'var(--on-surface)', margin: '0.2rem 0' }}>
            {applications.length}
          </div>
          <Link to="/apply" className="m3-label-medium" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
            Submit / update choices <ArrowRight size={13} />
          </Link>
        </Card>

        <Card
          className="m3-span-3"
          variant="tonal"
          hoverable
          onClick={() => navigate('/roommates')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--secondary-container)',
                color: 'var(--on-secondary-container)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </span>
            <Sparkles size={16} color="var(--primary)" />
          </div>
          <div className="m3-title-medium" style={{ color: 'var(--on-surface)', marginBottom: '0.25rem' }}>
            Roommate Matching
          </div>
          <p className="m3-body-small" style={{ margin: 0 }}>
            7-factor deterministic lifestyle harmony with mutual room locking.
          </p>
        </Card>

        <Card
          className="m3-span-3"
          variant="tonal"
          hoverable
          onClick={() => navigate('/rooms')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                backgroundColor: 'var(--primary-container)',
                color: 'var(--on-primary-container)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BedDouble size={20} />
            </span>
            <Building2 size={16} color="var(--primary)" />
          </div>
          <div className="m3-title-medium" style={{ color: 'var(--on-surface)', marginBottom: '0.25rem' }}>
            Room &amp; Tariff Catalog
          </div>
          <p className="m3-body-small" style={{ margin: 0 }}>
            Compare 1 to 8-seater AC &amp; Cooler units with live bed rosters.
          </p>
        </Card>
      </section>

      {/* ROW 3: Session Applications with M3 Filter Chips */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 className="m3-headline-small" style={{ margin: 0 }}>
              Session Applications
            </h2>
            <p className="m3-body-small" style={{ margin: '0.15rem 0 0' }}>
              Prioritized room &amp; hostel choices across active University intake cycles
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {applications.length > 0 && (
              <ContinuousTabs
                value={appFilter}
                onChange={(id) => setAppFilter(id as 'ALL' | 'ALLOCATED' | 'PENDING')}
                tabs={[
                  { id: 'ALL', label: 'All' },
                  { id: 'PENDING', label: 'In Progress' },
                  { id: 'ALLOCATED', label: 'Allocated' },
                ]}
              />
            )}

            <Link to="/apply">
              <Button variant="primary" size="sm">
                <Plus size={15} />
                New Application
              </Button>
            </Link>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <Card variant="tonal" style={{ textAlign: 'center', padding: '2.5rem 1.25rem' }}>
            <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--surface-container-highest)',
                  color: 'var(--on-surface-variant)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={22} />
              </span>
              <div className="m3-title-medium" style={{ color: 'var(--on-surface)' }}>
                {applications.length === 0
                  ? 'No residential applications filed yet'
                  : 'No applications match this filter'}
              </div>
              <p className="m3-body-medium" style={{ margin: 0 }}>
                {applications.length === 0
                  ? 'Select up to 3 preferred hostels and rooms to enter the current allocation cycle.'
                  : 'Switch the filter chip above to view all submitted applications.'}
              </p>
              {applications.length === 0 && (
                <Link to="/apply" style={{ marginTop: '0.25rem' }}>
                  <Button variant="primary" size="sm">
                    Start Application
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredApplications.map((app) => (
              <Card key={app.id} variant="outlined">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.85rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <h4 className="m3-title-medium" style={{ margin: 0 }}>
                      Application <span className="tabular-nums">#{app.id}</span> · {app.cycle_name}
                    </h4>
                    <span className="m3-body-small tabular-nums">
                      Filed on {app.submitted_at}
                    </span>
                  </div>
                  <Badge
                    variant={
                      app.status === 'ALLOCATED'
                        ? 'success'
                        : app.status === 'SUBMITTED'
                        ? 'info'
                        : 'warning'
                    }
                    size="md"
                  >
                    {app.status_display}
                  </Badge>
                </div>

                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: app.review_notes ? '0.85rem' : 0 }}>
                  {app.choices.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '0.7rem 0.95rem',
                        backgroundColor: 'var(--surface-container-low)',
                        border: '1px solid var(--outline-variant)',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        fontSize: '0.875rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant="primary" size="sm">#{c.priority}</Badge>
                        <strong style={{ color: 'var(--on-surface)' }}>{c.hostel_name}</strong>
                      </span>
                      {c.room && (
                        <span className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                          Room <strong className="tabular-nums" style={{ color: 'var(--on-surface)' }}>{c.room.room_number}</strong> •{' '}
                          <span className="tabular-nums">{c.room.capacity}</span>-Seater
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {app.review_notes && (
                  <div
                    className="m3-body-small"
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--md-sys-shape-corner-medium)',
                      backgroundColor: 'var(--tertiary-container)',
                      color: 'var(--on-tertiary-container)',
                    }}
                  >
                    <strong>Warden Review Note:</strong> &ldquo;{app.review_notes}&rdquo;
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ROW 4: Daily Residence & Campus Operations Hub */}
      <section>
        <div style={{ marginBottom: '1rem' }}>
          <h2 className="m3-headline-small" style={{ margin: 0 }}>
            Daily Residence &amp; Campus Operations
          </h2>
          <p className="m3-body-small" style={{ margin: '0.15rem 0 0' }}>
            Digital turnstile gate passes and room maintenance SLA tracking
          </p>
        </div>

        <div className="m3-grid">
          <div className="m3-span-6">
            <GatePassWidget />
          </div>
          <div className="m3-span-6">
            <RMSDeskWidget />
          </div>
        </div>
      </section>

      <EconomicsCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
