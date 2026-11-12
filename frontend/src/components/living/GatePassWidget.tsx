import React, { useState, useEffect } from 'react';
import { livingApi } from '../../api/livingApi';
import { GatePassItem, PassType } from '../../types/living';
import { QrCode, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const GatePassWidget: React.FC = () => {
  const [passes, setPasses] = useState<GatePassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPassForQr, setSelectedPassForQr] = useState<GatePassItem | null>(null);

  const [passType, setPassType] = useState<PassType>('DAY_PASS');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadPasses = () => {
    setIsLoading(true);
    livingApi
      .getGatePasses()
      .then((res) => setPasses(res.gate_passes || []))
      .catch((err) => console.error('Failed to load gate passes:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPasses();
  }, []);

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason || !departureDate || !expectedReturnDate) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    livingApi
      .createGatePass({
        pass_type: passType,
        destination,
        reason,
        departure_date: new Date(departureDate).toISOString(),
        expected_return_date: new Date(expectedReturnDate).toISOString(),
      })
      .then(() => {
        setShowModal(false);
        setDestination('');
        setReason('');
        loadPasses();
      })
      .catch((err) => setErrorMsg(err.message || 'Failed to submit gate pass request.'))
      .finally(() => setSubmitting(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="sm">Approved</Badge>;
      case 'ACTIVE_OUTSIDE':
        return <Badge variant="warning" size="sm">Outside Campus</Badge>;
      case 'PENDING_WARDEN':
        return <Badge variant="warning" size="sm">Pending Warden</Badge>;
      case 'PENDING_PARENT':
        return <Badge variant="warning" size="sm">Pending Parent</Badge>;
      case 'CLOSED_RETURNED':
        return <Badge variant="neutral" size="sm">Returned</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
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
            Turnstile Access
          </span>
          <h3 className="m3-title-large" style={{ margin: '0.15rem 0 0' }}>
            Digital Gate Pass Hub
          </h3>
        </div>

        <Button size="sm" variant="tonal" onClick={() => setShowModal(true)}>
          <Plus size={15} />
          Request Outing
        </Button>
      </div>

      {isLoading ? (
        <div className="m3-body-medium" style={{ padding: '1.25rem', textAlign: 'center' }}>
          Loading gate pass credentials...
        </div>
      ) : passes.length === 0 ? (
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
          <ShieldCheck size={24} color="var(--primary)" />
          <p className="m3-body-medium" style={{ margin: 0 }}>
            No active or past gate passes on record.
          </p>
          <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>
            Apply for Outing Pass
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {passes.slice(0, 3).map((p) => (
            <div
              key={p.id}
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
                  <span className="m3-title-small" style={{ color: 'var(--on-surface)' }}>
                    {p.destination}
                  </span>
                  <span className="m3-body-small">({p.pass_type_display})</span>
                  {getStatusBadge(p.status)}
                </div>
                <div className="m3-body-small tabular-nums">
                  Expected: {new Date(p.departure_date).toLocaleDateString()}  · {' '}
                  {new Date(p.expected_return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {p.qr_token && (
                <Button size="sm" variant="outline" onClick={() => setSelectedPassForQr(p)}>
                  <QrCode size={14} />
                  QR Pass
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Turnstile QR Code Dialog */}
      <Modal
        isOpen={Boolean(selectedPassForQr)}
        onClose={() => setSelectedPassForQr(null)}
        title="Security Turnstile Token"
        maxWidth="390px"
      >
        {selectedPassForQr && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '188px',
                height: '188px',
                margin: '0 auto 1.25rem',
                backgroundColor: 'var(--md-sys-color-on-surface)',
                padding: '12px',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  borderRadius: 'var(--md-sys-shape-corner-small)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  padding: '10px',
                  wordBreak: 'break-all',
                }}
              >
                QR: {selectedPassForQr.qr_token.slice(0, 32)}...
              </div>
            </div>

            <h4 className="m3-title-large" style={{ margin: '0 0 0.25rem' }}>
              {selectedPassForQr.destination}
            </h4>
            <p className="m3-body-small" style={{ margin: '0 0 1.25rem' }}>
              Present this encrypted token at campus turnstiles (Gate 1, 2, or 4).
            </p>
            <Button variant="tonal" size="md" onClick={() => setSelectedPassForQr(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>

      {/* Outing Request Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Campus Outing Pass"
        maxWidth="490px"
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

        <form onSubmit={handleCreatePass} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
              Pass Type
            </label>
            <select
              value={passType}
              onChange={(e) => setPassType(e.target.value as PassType)}
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="DAY_PASS">Day Pass (Return before 09:30 PM)</option>
              <option value="NIGHT_OUT">Night Out (Return next morning)</option>
              <option value="LEAVE">Official Leave / Home Visit</option>
              <option value="EMERGENCY">Emergency Exit</option>
            </select>
          </div>

          <div>
            <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
              Destination (e.g., Jalandhar City / Phagwara / Hometown)
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Model Town, Jalandhar"
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
              Reason for Outing
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Doctor appointment, Academic books purchase"
              style={{ width: '100%', padding: '0.6rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
                Departure Date &amp; Time
              </label>
              <input
                type="datetime-local"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.65rem', fontSize: '0.8125rem' }}
              />
            </div>
            <div>
              <label className="m3-label-medium" style={{ display: 'block', marginBottom: '0.35rem', color: 'var(--on-surface)' }}>
                Expected Return
              </label>
              <input
                type="datetime-local"
                required
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.65rem', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="button" variant="text" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
