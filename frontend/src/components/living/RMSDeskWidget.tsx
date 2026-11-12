import React, { useState, useEffect } from 'react';
import { livingApi } from '../../api/livingApi';
import { RMSTicketItem, RMSTradeCategory, RMSTicketPriority } from '../../types/living';
import { Plus, Wrench } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const RMSDeskWidget: React.FC = () => {
  const [tickets, setTickets] = useState<RMSTicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState<RMSTradeCategory>('ELECTRICAL');
  const [priority, setPriority] = useState<RMSTicketPriority>('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadTickets = () => {
    setIsLoading(true);
    livingApi
      .getRMSTickets()
      .then((res) => setTickets(res.tickets || []))
      .catch((err) => console.error('Failed to load RMS tickets:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setErrorMsg('Title and description are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    livingApi
      .createRMSTicket({
        category,
        priority,
        title,
        description,
      })
      .then(() => {
        setShowModal(false);
        setTitle('');
        setDescription('');
        loadTickets();
      })
      .catch((err) => setErrorMsg(err.message || 'Failed to log maintenance ticket.'))
      .finally(() => setSubmitting(false));
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'EMERGENCY':
        return <Badge variant="danger" size="sm">Emergency (4h SLA)</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">High (12h SLA)</Badge>;
      case 'MEDIUM':
        return <Badge variant="info" size="sm">Medium (24h SLA)</Badge>;
      case 'LOW':
        return <Badge variant="neutral" size="sm">Low (48h SLA)</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{p}</Badge>;
    }
  };

  return (
    <Card variant="outlined" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--outline-variant)',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="m3-label-small" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            RMS Service Desk
          </span>
          <h3 className="m3-title-large" style={{ margin: '0.15rem 0 0' }}>
            Room Maintenance &amp; SLA
          </h3>
        </div>

        <Button size="sm" variant="tonal" onClick={() => setShowModal(true)}>
          <Plus size={15} />
          Report Issue
        </Button>
      </div>

      {isLoading ? (
        <div className="m3-body-medium" style={{ padding: '1.25rem', textAlign: 'center' }}>
          Loading maintenance tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div
          style={{
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            backgroundColor: 'var(--surface-container-low)',
            border: '1px dashed var(--outline-variant)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Wrench size={24} color="var(--primary)" />
          <p className="m3-body-medium" style={{ margin: 0 }}>
            No active room complaints or repairs pending.
          </p>
          <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>
            Log Maintenance Ticket
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tickets.slice(0, 3).map((t) => (
            <div
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--surface-container-low)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <span className="m3-label-small tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    #{t.ticket_number}
                  </span>
                  <span className="m3-title-small" style={{ color: 'var(--on-surface)' }}>
                    {t.title}
                  </span>
                  {getPriorityBadge(t.priority)}
                </div>
                <div className="m3-body-small tabular-nums">
                  Room {t.room_number} • {t.category_display} • SLA:{' '}
                  {new Date(t.sla_deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </div>

              <div>
                {t.is_escalated ? (
                  <Badge variant="danger" size="sm">Escalated</Badge>
                ) : t.status === 'RESOLVED' ? (
                  <Badge variant="success" size="sm">Resolved</Badge>
                ) : (
                  <Badge variant="warning" size="sm">{t.status_display}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Maintenance Issue"
        maxWidth="500px"
      >
        {errorMsg && (
          <div
            className="m3-body-small"
            style={{
              padding: '0.75rem 0.9rem',
              backgroundColor: 'var(--error-container)',
              color: 'var(--on-error-container)',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              marginBottom: '1rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
                Trade Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RMSTradeCategory)}
                style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.8125rem' }}
              >
                <option value="PLUMBING">Plumbing &amp; Water Supply</option>
                <option value="ELECTRICAL">Electrical &amp; Lighting</option>
                <option value="WIFI_LAN">Wi-Fi / LAN Internet</option>
                <option value="CARPENTRY">Carpentry &amp; Furniture</option>
                <option value="APPLIANCE">Appliance / Air Conditioning</option>
                <option value="PEST_CONTROL">Pest Control &amp; Sanitation</option>
              </select>
            </div>

            <div>
              <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
                Urgency &amp; SLA
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RMSTicketPriority)}
                style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.8125rem' }}
              >
                <option value="LOW">Low (48 Hour Resolution)</option>
                <option value="MEDIUM">Medium (24 Hour Resolution)</option>
                <option value="HIGH">High (12 Hour Resolution)</option>
                <option value="EMERGENCY">Emergency (4 Hour Resolution)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
              Issue Summary
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study desk tube light flickering continuously"
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
              Detailed Description &amp; Location in Room
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details (e.g. Bed B side socket sparking when laptop charger plugged in)..."
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="button" variant="text" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {submitting ? 'Dispatching...' : 'Dispatch Ticket'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
