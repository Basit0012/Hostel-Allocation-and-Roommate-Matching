import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  CheckCircle,
  Compass,
  ExternalLink,
  ShieldCheck,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react';
import { livingApi } from '../../api/livingApi';
import { hostelsApi } from '../../api/hostelsApi';
import { GatePassItem, RMSTicketItem } from '../../types/living';
import { HostelSummary } from '../../types/hostel';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import { InlineTableControl } from '../watermelon/InlineTableControl';

interface WardenCommandCenterProps {
  userEmail: string;
  role: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export const WardenCommandCenter: React.FC<WardenCommandCenterProps> = ({ userEmail, role }) => {
  const [gatePasses, setGatePasses] = useState<GatePassItem[]>([]);
  const [rmsTickets, setRmsTickets] = useState<RMSTicketItem[]>([]);
  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      livingApi.getGatePasses().catch(() => ({ gate_passes: [] })),
      livingApi.getRMSTickets().catch(() => ({ tickets: [] })),
      hostelsApi.getHostels().catch(() => ({ hostels: [] })),
    ])
      .then(([passData, ticketData, hostelData]) => {
        setGatePasses(passData.gate_passes || []);
        setRmsTickets(ticketData.tickets || []);
        setHostels(hostelData.hostels || []);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprovePass = (passId: number) => {
    setActionLoadingId(passId);
    livingApi
      .gatePassAction(passId, 'warden_approve', 'Approved by hostel warden on duty.')
      .then(() => loadData())
      .catch((err) => alert(err.message || 'Approval failed.'))
      .finally(() => setActionLoadingId(null));
  };

  const handleRejectPass = (passId: number) => {
    const reason = prompt('Reason for rejecting gate pass:') || 'Rejected by hostel administration.';
    setActionLoadingId(passId);
    livingApi
      .gatePassAction(passId, 'warden_reject', reason)
      .then(() => loadData())
      .catch((err) => alert(err.message || 'Rejection failed.'))
      .finally(() => setActionLoadingId(null));
  };

  const handleUpdateTicket = (ticketId: number, status: 'IN_PROGRESS' | 'RESOLVED') => {
    setActionLoadingId(ticketId);
    livingApi
      .updateRMSTicketStatus(ticketId, status, `Updated to ${status} by warden.`)
      .then(() => loadData())
      .catch((err) => alert(err.message || 'Ticket update failed.'))
      .finally(() => setActionLoadingId(null));
  };

  if (isLoading) return <Spinner label="Loading warden operations command desk..." />;

  const pendingPasses = gatePasses.filter(
    (p) => p.status === 'SUBMITTED' || p.status === 'PENDING_WARDEN'
  );
  const activeOutsidePasses = gatePasses.filter((p) => p.status === 'ACTIVE_OUTSIDE');
  const activeTickets = rmsTickets.filter(
    (t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  );

  const totalBeds = hostels.reduce((acc, h) => acc + h.total_beds, 0);
  const vacantBeds = hostels.reduce((acc, h) => acc + h.vacant_beds, 0);
  const occupiedPct = totalBeds > 0 ? Math.round(((totalBeds - vacantBeds) / totalBeds) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* M3 Operations Hero Banner */}
      <section
        style={{
          borderRadius: 'var(--md-sys-shape-corner-extra-large)',
          padding: '1.75rem',
          backgroundColor: 'var(--primary-container)',
          color: 'var(--on-primary-container)',
          border: '1px solid var(--outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Badge variant="primary" size="sm">Residential Operations</Badge>
            <Badge variant="info" size="sm">{role}</Badge>
          </div>
          <h1 className="m3-display-small" style={{ margin: '0 0 0.35rem', color: 'var(--on-primary-container)' }}>
            Warden Command Center
          </h1>
          <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-primary-container)', opacity: 0.9 }}>
            Signed in as <strong>{userEmail}</strong> • Live campus census, gate pass authorizations &amp; RMS SLA dispatch
          </p>
        </div>

        <a
          href={`${API_BASE}/admin/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="primary" size="md">
            Open Django Admin Console
            <ExternalLink size={15} />
          </Button>
        </a>
      </section>

      {/* Overview Census Metric Bento Cards */}
      <section className="m3-grid">
        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Campus Bed Capacity</span>
            <BedDouble size={18} color="var(--primary)" />
          </div>
          <div className="m3-headline-medium tabular-nums" style={{ color: 'var(--on-surface)' }}>
            {totalBeds.toLocaleString('en-IN')} Beds
          </div>
          <div className="m3-body-small" style={{ marginTop: '0.25rem' }}>
            Across {hostels.length} Complex Towers
          </div>
        </Card>

        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Vacant Slots</span>
            <CheckCircle size={18} color="var(--md-sys-color-success)" />
          </div>
          <div className="m3-headline-medium tabular-nums" style={{ color: 'var(--md-sys-color-success)' }}>
            {vacantBeds.toLocaleString('en-IN')} Free
          </div>
          <div style={{ marginTop: '0.5rem', height: '6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--surface-container-highest)', overflow: 'hidden' }}>
            <div style={{ width: `${occupiedPct}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-full)' }} />
          </div>
        </Card>

        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Pending Outing Passes</span>
            <Users size={18} color="var(--primary)" />
          </div>
          <div className="m3-headline-medium tabular-nums" style={{ color: 'var(--primary)' }}>
            {pendingPasses.length} Pending
          </div>
          <div className="m3-body-small" style={{ marginTop: '0.25rem' }}>
            {activeOutsidePasses.length} residents currently outside
          </div>
        </Card>

        <Card className="m3-span-3" variant="outlined">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="m3-label-medium" style={{ color: 'var(--on-surface-variant)' }}>Active RMS Tickets</span>
            <Wrench size={18} color={activeTickets.length > 0 ? 'var(--md-sys-color-warning)' : 'var(--md-sys-color-success)'} />
          </div>
          <div
            className="m3-headline-medium tabular-nums"
            style={{ color: activeTickets.length > 0 ? 'var(--md-sys-color-warning)' : 'var(--md-sys-color-success)' }}
          >
            {activeTickets.length} Open
          </div>
          <div className="m3-body-small" style={{ marginTop: '0.25rem' }}>
            Under active maintenance SLA
          </div>
        </Card>
      </section>

      {/* Two Column Workflow: Gate Passes & RMS Maintenance */}
      <section className="m3-grid">
        {/* Outing Gate Pass Approvals Queue */}
        <Card className="m3-span-6" variant="outlined" style={{ padding: '1.35rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--outline-variant)',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <span className="m3-label-small" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Turnstile Security Authorizations
              </span>
              <h3 className="m3-title-large" style={{ margin: '0.15rem 0 0' }}>
                Gate Pass Approvals Queue
              </h3>
            </div>
            <Badge variant={pendingPasses.length > 0 ? 'warning' : 'success'}>
              {pendingPasses.length} Requiring Action
            </Badge>
          </div>

          {pendingPasses.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                backgroundColor: 'var(--surface-container-low)',
                border: '1px dashed var(--outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldCheck size={28} color="var(--md-sys-color-success)" />
              <div className="m3-body-medium">All student outing requests are reviewed and up-to-date.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingPasses.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '0.95rem 1rem',
                    backgroundColor: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                    <strong className="m3-title-small" style={{ color: 'var(--on-surface)' }}>
                      {(p as GatePassItem & { student_name?: string }).student_name || 'Resident'}
                    </strong>
                    <span className="m3-label-small tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--on-surface-variant)' }}>
                      #{(p as GatePassItem & { student_id?: string }).student_id || 'N/A'}
                    </span>
                    <Badge variant="neutral" size="sm">{p.pass_type_display}</Badge>
                  </div>

                  <div className="m3-body-medium" style={{ color: 'var(--on-surface)' }}>
                    Destination: <strong>{p.destination}</strong>
                  </div>
                  <div className="m3-body-small" style={{ marginBottom: '0.65rem' }}>
                    Reason: &ldquo;{p.reason}&rdquo;
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--outline-variant)',
                      paddingTop: '0.6rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span className="m3-body-small tabular-nums">
                      {new Date(p.departure_date).toLocaleDateString()}  · {' '}
                      {new Date(p.expected_return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={actionLoadingId === p.id}
                        onClick={() => handleApprovePass(p.id)}
                      >
                        <CheckCircle size={13} />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={actionLoadingId === p.id}
                        onClick={() => handleRejectPass(p.id)}
                      >
                        <XCircle size={13} />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* RMS Maintenance Dispatch Queue */}
        <Card className="m3-span-6" variant="outlined" style={{ padding: '1.35rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--outline-variant)',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <span className="m3-label-small" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Relationship Management System
              </span>
              <h3 className="m3-title-large" style={{ margin: '0.15rem 0 0' }}>
                Room Maintenance Dispatch
              </h3>
            </div>
            <Badge variant={activeTickets.length > 0 ? 'warning' : 'success'}>
              {activeTickets.length} Active SLA Tasks
            </Badge>
          </div>

          {activeTickets.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                backgroundColor: 'var(--surface-container-low)',
                border: '1px dashed var(--outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle size={28} color="var(--md-sys-color-success)" />
              <div className="m3-body-medium">Zero room maintenance tickets pending across your towers.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeTickets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '0.95rem 1rem',
                    backgroundColor: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span className="m3-label-small tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                          #{t.ticket_number}
                        </span>
                        <strong className="m3-title-small" style={{ color: 'var(--on-surface)' }}>
                          {t.title}
                        </strong>
                      </div>
                      <div className="m3-body-small" style={{ color: 'var(--on-surface)' }}>
                        Room <strong>{t.room_number}</strong> • {t.hostel_name} ({t.category_display})
                      </div>
                      <div className="m3-body-small">&ldquo;{t.description}&rdquo;</div>
                    </div>

                    <Badge variant={t.priority === 'EMERGENCY' ? 'danger' : 'warning'} size="sm">
                      {t.priority_display}
                    </Badge>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--outline-variant)',
                      paddingTop: '0.6rem',
                      marginTop: '0.35rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <span className="m3-body-small tabular-nums">
                      SLA: {new Date(t.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      {t.status === 'OPEN' && (
                        <Button
                          size="sm"
                          variant="tonal"
                          disabled={actionLoadingId === t.id}
                          onClick={() => handleUpdateTicket(t.id, 'IN_PROGRESS')}
                        >
                          Mark In Progress
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={actionLoadingId === t.id}
                        onClick={() => handleUpdateTicket(t.id, 'RESOLVED')}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Assigned Residential Complexes Direct Blueprint Navigator */}
      <section className="space-y-4">
        <div>
          <h2 className="m3-headline-small" style={{ margin: 0 }}>
            Residential Towers · Floor Blueprint Navigator
          </h2>
          <p className="m3-body-small" style={{ margin: '0.15rem 0 0' }}>
            Inspect campus complex occupancy or open any block 2D CAD Floor Plan and live bed roster
          </p>
        </div>

        <InlineTableControl
          allowEdit={false}
          data={hostels.map((h) => ({
            id: h.id,
            code: h.code,
            name: h.name,
            policy: h.gender_policy_display,
            occupancy: `${h.vacant_beds} / ${h.total_beds} vacant (${h.occupancy_pct}%)`,
            blueprint: h.id,
          }))}
          columns={[
            {
              key: 'code',
              label: 'Block',
              editable: false,
              render: (row) => <span className="font-mono font-semibold text-foreground">{row.code}</span>,
            },
            { key: 'name', label: 'Hostel Complex', editable: false },
            { key: 'policy', label: 'Wing Policy', editable: false },
            {
              key: 'occupancy',
              label: 'Vacancy',
              editable: false,
              render: (row) => <span className="font-mono text-xs tabular-nums">{row.occupancy}</span>,
            },
            {
              key: 'blueprint',
              label: 'Action',
              align: 'right',
              editable: false,
              render: (row) => (
                <Link
                  to={`/hostels/${row.blueprint}`}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <Compass size={12} />
                  Open CAD Plan
                </Link>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
};
