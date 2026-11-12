import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BedDouble, CheckCircle2, ClipboardList, FileCheck2 } from 'lucide-react';
import { applicationsApi, ApplicationChoicePayload } from '../api/applicationsApi';
import { hostelsApi } from '../api/hostelsApi';
import { HostelSummary } from '../types/hostel';
import { RoomSummary } from '../types/room';
import { CycleInfo, HostelApplicationItem } from '../types/application';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

interface ChoiceSlotConfig {
  step: string;
  title: string;
  subtitle: string;
  required: boolean;
  hostelValue: number | '';
  setHostelValue: React.Dispatch<React.SetStateAction<number | ''>>;
  roomValue: number | '';
  setRoomValue: React.Dispatch<React.SetStateAction<number | ''>>;
}

export const ApplyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeCycle, setActiveCycle] = useState<CycleInfo | null>(null);
  const [applications, setApplications] = useState<HostelApplicationItem[]>([]);
  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const preselectedHostel = searchParams.get('hostel') ? Number(searchParams.get('hostel')) : undefined;
  const preselectedRoom = searchParams.get('room') ? Number(searchParams.get('room')) : undefined;
  const preselectedBed = searchParams.get('bed') || undefined;

  const [choice1Hostel, setChoice1Hostel] = useState<number | ''>(preselectedHostel || '');
  const [choice1Room, setChoice1Room] = useState<number | ''>(preselectedRoom || '');

  const [choice2Hostel, setChoice2Hostel] = useState<number | ''>('');
  const [choice2Room, setChoice2Room] = useState<number | ''>('');

  const [choice3Hostel, setChoice3Hostel] = useState<number | ''>('');
  const [choice3Room, setChoice3Room] = useState<number | ''>('');

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      applicationsApi.getApplications(),
      hostelsApi.getHostels(),
      hostelsApi.getRooms({ vacant_only: true }),
    ])
      .then(([appData, hostelData, roomData]) => {
        setActiveCycle(appData.active_cycle);
        setApplications(appData.applications);
        setHostels(hostelData.hostels);
        setRooms(roomData.rooms);

        if (preselectedRoom) {
          const target = roomData.rooms.find((r) => r.id === preselectedRoom);
          if (target) {
            setChoice1Hostel(target.hostel_id);
            setChoice1Room(target.id);
          }
        }
      })
      .catch((err) => setErrorMsg(err.message || 'Failed to load application portal data.'))
      .finally(() => setIsLoading(false));
  }, [preselectedRoom]);

  const getFilteredRooms = (hostelId: number | '') => {
    if (!hostelId) return [];
    return rooms.filter((r) => r.hostel_id === Number(hostelId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!choice1Hostel) {
      setErrorMsg('Choice #1 Hostel selection is mandatory.');
      return;
    }

    const payload: ApplicationChoicePayload[] = [
      {
        priority: 1,
        hostel_id: Number(choice1Hostel),
        room_id: choice1Room ? Number(choice1Room) : undefined,
      },
    ];

    if (choice2Hostel) {
      payload.push({
        priority: 2,
        hostel_id: Number(choice2Hostel),
        room_id: choice2Room ? Number(choice2Room) : undefined,
      });
    }

    if (choice3Hostel) {
      payload.push({
        priority: 3,
        hostel_id: Number(choice3Hostel),
        room_id: choice3Room ? Number(choice3Room) : undefined,
      });
    }

    setIsSubmitting(true);
    try {
      const res = await applicationsApi.submitApplication(payload);
      setSuccessMsg(res.message || 'Residential preference slate filed successfully.');
      const updated = await applicationsApi.getApplications();
      setApplications(updated.applications);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSubmittedApp = Boolean(
    activeCycle &&
      applications.some(
        (a) =>
          a.cycle_name === activeCycle.name &&
          ['SUBMITTED', 'UNDER_REVIEW', 'ALLOCATED', 'WAITLISTED'].includes(a.status),
      ),
  );

  const selectedRoomPreview = preselectedRoom ? rooms.find((r) => r.id === preselectedRoom) : undefined;

  const choiceSlots: ChoiceSlotConfig[] = [
    {
      step: '01',
      title: 'Primary Choice (Required)',
      subtitle: 'Your highest priority hostel tower & preferred room for merit allocation.',
      required: true,
      hostelValue: choice1Hostel,
      setHostelValue: setChoice1Hostel,
      roomValue: choice1Room,
      setRoomValue: setChoice1Room,
    },
    {
      step: '02',
      title: 'Secondary Fallback',
      subtitle: 'Considered automatically if Choice #1 reaches full bed saturation.',
      required: false,
      hostelValue: choice2Hostel,
      setHostelValue: setChoice2Hostel,
      roomValue: choice2Room,
      setRoomValue: setChoice2Room,
    },
    {
      step: '03',
      title: 'Third Fallback',
      subtitle: 'Recommended buffer wing so you retain seat priority in the active round.',
      required: false,
      hostelValue: choice3Hostel,
      setHostelValue: setChoice3Hostel,
      roomValue: choice3Room,
      setRoomValue: setChoice3Room,
    },
  ];

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
              <ClipboardList size={13} />
              Residential Preference Slate
            </span>
            <h1 className="m3-headline-medium" style={{ margin: '0.25rem 0 0.4rem', color: 'var(--on-surface)' }}>
              Official Hostel Application
            </h1>
            <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '62ch' }}>
              Submit up to three ordered hostel and room preferences for automated academic-year allotment processing.
            </p>
          </div>

          {activeCycle && (
            <div
              style={{
                padding: '0.75rem 1.15rem',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--outline-variant)',
              }}
            >
              <div className="m3-label-small" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>
                Active Intake Cycle
              </div>
              <div className="m3-title-small" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {activeCycle.name} ({activeCycle.academic_year})
              </div>
            </div>
          )}
        </div>
      </section>

      {isLoading ? (
        <Spinner label="Loading intake cycle and available rooms..." />
      ) : !activeCycle ? (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--md-sys-color-warning-container)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: '1px solid var(--outline-variant)',
            color: 'var(--md-sys-color-on-warning-container)',
            fontSize: '0.9375rem',
            fontWeight: 500,
          }}
        >
          No active accommodation intake cycle is currently accepting student submissions.
        </div>
      ) : hasSubmittedApp ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card variant="tonal" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <FileCheck2 size={18} />
                  Application Already On File
                </div>
                <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '60ch' }}>
                  You have an active residential application filed for {activeCycle.name}. University policy permits one active slate per academic intake cycle.
                </p>
              </div>
              <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
                Track Status on Dashboard
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>

          <h2 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)' }}>
            Submitted Application Record
          </h2>

          {applications.map((app) => (
            <Card key={app.id} variant="outlined" style={{ padding: '1.35rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingBottom: '0.9rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--outline-variant)',
                }}
              >
                <div>
                  <h3 className="m3-title-large" style={{ margin: '0 0 0.2rem', color: 'var(--on-surface)' }}>
                    Application #{app.id} · {app.cycle_name}
                  </h3>
                  <span className="m3-body-small tabular-nums" style={{ color: 'var(--on-surface-variant)' }}>
                    Filed {app.submitted_at}
                  </span>
                </div>
                <Badge
                  variant={app.status === 'ALLOCATED' ? 'success' : app.status === 'SUBMITTED' ? 'info' : 'warning'}
                  size="md"
                >
                  {app.status_display}
                </Badge>
              </div>

              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {app.choices.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '0.8rem 1rem',
                      backgroundColor: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      borderRadius: 'var(--md-sys-shape-corner-medium)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="m3-badge-step">0{c.priority}</span>
                      <span className="m3-title-small" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                        {c.hostel_name} ({c.hostel_code})
                      </span>
                    </div>
                    {c.room && (
                      <Badge variant="neutral" size="sm">
                        Room {c.room.room_number} ({c.room.capacity}-Seater)
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Preselected Blueprint / Catalog Callout */}
          {(selectedRoomPreview || preselectedRoom) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.95rem 1.2rem',
                marginBottom: '1.25rem',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                backgroundColor: 'var(--primary-container)',
                color: 'var(--on-primary-container)',
                border: '1px solid var(--outline-variant)',
              }}
            >
              <BedDouble size={20} />
              <div className="m3-body-medium" style={{ fontWeight: 600 }}>
                Pre-selected from Blueprint:{' '}
                {selectedRoomPreview
                  ? `${selectedRoomPreview.hostel_code} · Room ${selectedRoomPreview.room_number} (${selectedRoomPreview.capacity}-Seater)`
                  : `Room #${preselectedRoom}`}
                {preselectedBed ? ` · Bed ${preselectedBed}` : ''} locked as Choice #1.
              </div>
            </div>
          )}

          <Card variant="elevated" style={{ padding: '1.6rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {successMsg && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--md-sys-color-success-container)',
                    color: 'var(--md-sys-color-on-success-container)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={17} />
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--error-container)',
                    color: 'var(--on-error-container)',
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {choiceSlots.map((slot) => (
                <div
                  key={slot.step}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    backgroundColor: 'var(--surface-container-low)',
                    border: '1px solid var(--outline-variant)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span className="m3-badge-step">{slot.step}</span>
                    <div>
                      <h2 className="m3-title-medium" style={{ margin: 0, color: 'var(--on-surface)', fontWeight: 700 }}>
                        {slot.title}
                      </h2>
                      <p className="m3-body-small" style={{ margin: '0.15rem 0 0', color: 'var(--on-surface-variant)' }}>
                        {slot.subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <label
                        className="m3-label-small"
                        style={{
                          display: 'block',
                          color: 'var(--on-surface-variant)',
                          textTransform: 'uppercase',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Hostel Complex {slot.required ? '*' : ''}
                      </label>
                      <select
                        className="m3-field-control"
                        required={slot.required}
                        value={slot.hostelValue}
                        onChange={(e) => {
                          slot.setHostelValue(e.target.value ? Number(e.target.value) : '');
                          slot.setRoomValue('');
                        }}
                      >
                        <option value="">{slot.required ? 'Select Primary Hostel...' : 'Skip Optional Choice...'}</option>
                        {hostels.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.code} · {h.name} ({h.vacant_beds} vacant)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="m3-label-small"
                        style={{
                          display: 'block',
                          color: 'var(--on-surface-variant)',
                          textTransform: 'uppercase',
                          marginBottom: '0.35rem',
                        }}
                      >
                        Specific Room Preference
                      </label>
                      <select
                        className="m3-field-control"
                        value={slot.roomValue}
                        onChange={(e) => slot.setRoomValue(e.target.value ? Number(e.target.value) : '')}
                        disabled={!slot.hostelValue}
                      >
                        <option value="">Any Available Room</option>
                        {getFilteredRooms(slot.hostelValue).map((r) => (
                          <option key={r.id} value={r.id}>
                            Room {r.room_number} ({r.capacity}-Seater, {r.is_air_conditioned ? 'AC' : 'Cooler'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} style={{ width: '100%' }}>
                Submit Official Application
                <ArrowRight size={17} />
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
