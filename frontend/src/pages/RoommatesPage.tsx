import React, { useEffect, useState } from 'react';
import { Inbox, Search, SlidersHorizontal, Sparkles, UserCheck, Users, X } from 'lucide-react';
import { roommatesApi, DiscoverResponse, RequestsResponse } from '../api/roommatesApi';
import { RoommateGroupData, RoommatePreferences } from '../types/roommate';
import { CandidateCard } from '../components/roommate/CandidateCard';
import { PreferenceForm } from '../components/roommate/PreferenceForm';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ContinuousTabs } from '../components/watermelon/ContinuousTabs';

type ActiveTab = 'DISCOVER' | 'REQUESTS' | 'GROUP' | 'PREFERENCES';

export const RoommatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DISCOVER');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [discoverData, setDiscoverData] = useState<DiscoverResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [requestsData, setRequestsData] = useState<RequestsResponse | null>(null);
  const [preferences, setPreferences] = useState<RoommatePreferences | null>(null);
  const [group, setGroup] = useState<RoommateGroupData | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [disc, reqs, prefs, grp] = await Promise.all([
        roommatesApi.discoverCandidates().catch(() => null),
        roommatesApi.getRequests().catch(() => null),
        roommatesApi.getPreferences().catch(() => null),
        roommatesApi.getGroup().catch(() => null),
      ]);
      setDiscoverData(disc);
      setRequestsData(reqs);
      setPreferences(prefs?.preferences || null);
      setGroup(grp?.group || null);
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load roommate compatibility portal.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setFeedback(null);
    try {
      const res = await roommatesApi.discoverCandidates(searchQuery.trim() || undefined);
      setDiscoverData(res);
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Student lookup failed.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setIsSearching(true);
    try {
      const res = await roommatesApi.discoverCandidates();
      setDiscoverData(res);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (targetStudentId: string) => {
    setSendingId(targetStudentId);
    setFeedback(null);
    try {
      const res = await roommatesApi.sendRequest(targetStudentId);
      setFeedback({ type: 'success', text: res.message || `Roommate request sent to #${targetStudentId}.` });
      await loadData();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to send roommate request.' });
    } finally {
      setSendingId(null);
    }
  };

  const handleRespondRequest = async (requestId: number, action: 'ACCEPT' | 'REJECT') => {
    setFeedback(null);
    try {
      const res = await roommatesApi.respondRequest(requestId, action);
      setFeedback({ type: 'success', text: res.message || (action === 'ACCEPT' ? 'Roommate match accepted.' : 'Request declined.') });
      await loadData();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to respond to request.' });
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    setFeedback(null);
    try {
      const res = await roommatesApi.cancelRequest(requestId);
      setFeedback({ type: 'success', text: res.message || 'Outgoing request cancelled.' });
      await loadData();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Failed to cancel request.' });
    }
  };

  const handleSavePreferences = async (values: RoommatePreferences) => {
    await roommatesApi.savePreferences(values);
    setFeedback({ type: 'success', text: '7-Factor lifestyle preferences updated and recommendations recalculated.' });
    await loadData();
    setActiveTab('DISCOVER');
  };

  const pendingIncomingCount = (requestsData?.received_requests || []).filter((r) => r.status === 'PENDING').length;
  const totalRequestsCount =
    (requestsData?.received_requests.length || 0) + (requestsData?.sent_requests.length || 0);

  return (
    <div className="container">
      {/* Tonal M3 Header Banner */}
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
              <Sparkles size={13} />
              7-Factor Compatibility Engine
            </span>
            <h1 className="m3-headline-medium" style={{ margin: '0.25rem 0 0.4rem', color: 'var(--on-surface)' }}>
              Peer Matching &amp; Group Roster
            </h1>
            <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)', maxWidth: '62ch' }}>
              Compare deterministic compatibility scores across sleep rhythm, study focus, cleanliness, and cooling preference before forming your mutual roommate group.
            </p>
          </div>

          {discoverData?.active_cycle && (
            <Badge variant="info" size="md">
              {discoverData.active_cycle}
            </Badge>
          )}
        </div>
      </section>

      {/* Watermelon Animated Segmented Tabs */}
      <div className="mb-6 overflow-x-auto">
        <ContinuousTabs
          value={activeTab}
          onChange={(id) => setActiveTab(id as ActiveTab)}
          tabs={[
            { id: 'DISCOVER', label: 'Discover Peers' },
            {
              id: 'REQUESTS',
              label: `Requests (${pendingIncomingCount > 0 ? `${pendingIncomingCount} New` : totalRequestsCount})`,
            },
            { id: 'GROUP', label: group ? `Group #${group.id}` : 'Active Group' },
            { id: 'PREFERENCES', label: 'Lifestyle Profile' },
          ]}
        />
      </div>

      {/* Inline Feedback Toast / Banner */}
      {feedback && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.15rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            backgroundColor: feedback.type === 'success' ? 'var(--status-success-bg)' : 'var(--error-container)',
            color: feedback.type === 'success' ? 'var(--md-sys-color-on-success-container)' : 'var(--on-error-container)',
            border: '1px solid var(--outline-variant)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Workspace */}
      {isLoading ? (
        <Spinner label="Evaluating lifestyle compatibility vectors..." />
      ) : error ? (
        <Card variant="outlined" style={{ padding: '2rem', textAlign: 'center', color: 'var(--status-danger)' }}>
          {error}
        </Card>
      ) : (
        <div>
          {/* TAB 1: DISCOVER */}
          {activeTab === 'DISCOVER' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!discoverData?.has_preferences && (
                <div
                  style={{
                    padding: '1.25rem 1.4rem',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    backgroundColor: 'var(--md-sys-color-warning-container)',
                    color: 'var(--md-sys-color-on-warning-container)',
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div className="m3-title-small" style={{ fontWeight: 700, marginBottom: '0.2rem' }}>
                      Lifestyle Vector Incomplete
                    </div>
                    <div className="m3-body-small" style={{ opacity: 0.92 }}>
                      Complete the 7-factor questionnaire so the compatibility engine can score your match percentages against same-gender applicants.
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('PREFERENCES')}>
                    <SlidersHorizontal size={15} /> Complete Questionnaire
                  </Button>
                </div>
              )}

              {/* Search Student Form */}
              <Card variant="outlined" style={{ padding: '1.15rem' }}>
                <form
                  onSubmit={handleSearch}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
                >
                  <div className="m3-search-shell">
                    <Search
                      size={16}
                      color="var(--on-surface-variant)"
                      style={{ position: 'absolute', left: '0.95rem', pointerEvents: 'none' }}
                    />
                    <input
                      type="text"
                      className="m3-search-input"
                      placeholder="Lookup classmate by exact LPU Student ID (e.g., 12400002)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" isLoading={isSearching}>
                    Lookup Student
                  </Button>
                  {discoverData?.search_result && (
                    <Button type="button" variant="tonal" size="md" onClick={handleClearSearch}>
                      Clear
                    </Button>
                  )}
                </form>
              </Card>

              {/* Direct Lookup Result */}
              {discoverData?.search_result && (
                <div>
                  <h2 className="m3-title-large" style={{ margin: '0 0 0.85rem', color: 'var(--on-surface)' }}>
                    Direct Student Lookup
                  </h2>
                  <div style={{ maxWidth: '400px' }}>
                    <CandidateCard
                      candidate={discoverData.search_result}
                      onSendRequest={handleSendRequest}
                      isSending={sendingId === discoverData.search_result.student_id}
                    />
                  </div>
                </div>
              )}

              {/* Algorithmic Recommendations Grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)' }}>
                    Recommended Compatibility Matches
                  </h2>
                  <span className="m3-label-medium tabular-nums" style={{ color: 'var(--on-surface-variant)' }}>
                    {discoverData?.recommendations.length || 0} candidates ranked
                  </span>
                </div>

                {discoverData && discoverData.recommendations.length > 0 ? (
                  <div className="m3-catalog-grid">
                    {discoverData.recommendations.map((c) => (
                      <CandidateCard
                        key={c.student_id}
                        candidate={c}
                        onSendRequest={handleSendRequest}
                        isSending={sendingId === c.student_id}
                      />
                    ))}
                  </div>
                ) : (
                  <Card variant="outlined" style={{ padding: '2.5rem', textAlign: 'center' }}>
                    <h3 className="m3-title-medium" style={{ margin: '0 0 0.4rem', color: 'var(--on-surface)' }}>
                      No Candidates Ranked Yet
                    </h3>
                    <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
                      No same-gender applicants currently match in this intake cycle or preferences have not yet been saved.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REQUESTS */}
          {activeTab === 'REQUESTS' && (
            <div className="m3-grid">
              {/* Incoming */}
              <div className="m3-span-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h2 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)' }}>
                    Incoming Requests
                  </h2>
                  <Badge variant="info" size="sm">
                    {requestsData?.received_requests.length || 0} Total
                  </Badge>
                </div>

                {!requestsData?.received_requests.length ? (
                  <Card variant="outlined" style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    No incoming roommate invitations yet.
                  </Card>
                ) : (
                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    {requestsData.received_requests.map((r) => (
                      <Card key={r.id} variant="outlined" style={{ padding: '1.1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <div className="m3-title-medium" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                              {r.other_full_name}
                            </div>
                            <div className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                              <span className="tabular-nums">#{r.other_student_id}</span> · {r.other_branch} · {r.created_at}
                            </div>
                          </div>
                          <Badge
                            variant={r.status === 'ACCEPTED' ? 'success' : r.status === 'PENDING' ? 'info' : 'neutral'}
                            size="sm"
                          >
                            {r.status_display}
                          </Badge>
                        </div>

                        {r.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button variant="primary" size="sm" onClick={() => handleRespondRequest(r.id, 'ACCEPT')}>
                              <UserCheck size={14} /> Accept Match
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleRespondRequest(r.id, 'REJECT')}>
                              Decline
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing */}
              <div className="m3-span-6">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h2 className="m3-title-large" style={{ margin: 0, color: 'var(--on-surface)' }}>
                    Sent Invitations
                  </h2>
                  <Badge variant="neutral" size="sm">
                    {requestsData?.sent_requests.length || 0} Sent
                  </Badge>
                </div>

                {!requestsData?.sent_requests.length ? (
                  <Card variant="outlined" style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                    You have not sent any roommate invitations yet.
                  </Card>
                ) : (
                  <div style={{ display: 'grid', gap: '0.85rem' }}>
                    {requestsData.sent_requests.map((r) => (
                      <Card key={r.id} variant="outlined" style={{ padding: '1.1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: r.status === 'PENDING' ? '0.75rem' : 0 }}>
                          <div>
                            <div className="m3-title-medium" style={{ fontWeight: 700, color: 'var(--on-surface)' }}>
                              {r.other_full_name}
                            </div>
                            <div className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                              <span className="tabular-nums">#{r.other_student_id}</span> · {r.other_branch} · {r.created_at}
                            </div>
                          </div>
                          <Badge
                            variant={r.status === 'ACCEPTED' ? 'success' : r.status === 'PENDING' ? 'warning' : 'neutral'}
                            size="sm"
                          >
                            {r.status_display}
                          </Badge>
                        </div>

                        {r.status === 'PENDING' && (
                          <Button variant="text" size="sm" onClick={() => handleCancelRequest(r.id)}>
                            Cancel Request
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GROUP */}
          {activeTab === 'GROUP' && (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              {group ? (
                <Card variant="elevated" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      paddingBottom: '1rem',
                      marginBottom: '1rem',
                      borderBottom: '1px solid var(--outline-variant)',
                    }}
                  >
                    <div>
                      <span className="m3-eyebrow-pill" style={{ marginBottom: '0.45rem' }}>
                        Roommate Group #{group.id}
                      </span>
                      <h2 className="m3-title-large" style={{ margin: '0.2rem 0 0', color: 'var(--on-surface)' }}>
                        {group.target_room.hostel_name} · Room {group.target_room.room_number}
                      </h2>
                    </div>

                    <Badge variant={group.is_confirmed ? 'success' : 'info'} size="md">
                      {group.is_confirmed ? 'Confirmed Roster' : 'Forming Group'}
                    </Badge>
                  </div>

                  {/* Enrollment Progress */}
                  <div
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--md-sys-shape-corner-large)',
                      backgroundColor: 'var(--surface-container-low)',
                      border: '1px solid var(--outline-variant)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--on-surface-variant)' }}>Roster Seats Filled</span>
                      <strong className="tabular-nums" style={{ color: 'var(--on-surface)' }}>
                        {group.member_count} of {group.capacity} Scholars
                      </strong>
                    </div>
                    <div className="m3-progress-track">
                      <div
                        className="m3-progress-fill"
                        style={{
                          width: `${group.capacity > 0 ? Math.min(100, (group.member_count / group.capacity) * 100) : 0}%`,
                          backgroundColor: 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>

                  <h3 className="m3-title-medium" style={{ margin: '0 0 0.75rem', color: 'var(--on-surface)' }}>
                    Confirmed Group Members
                  </h3>
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {group.members.map((m) => (
                      <div
                        key={m.student_id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--md-sys-shape-corner-medium)',
                          border: '1px solid var(--outline-variant)',
                          backgroundColor: 'var(--surface-container-low)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <div className="m3-title-small" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                            {m.full_name} <span className="tabular-nums" style={{ color: 'var(--primary)' }}>#{m.student_id}</span>
                          </div>
                          <div className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                            {m.branch}
                          </div>
                        </div>
                        <span className="m3-label-small tabular-nums" style={{ color: 'var(--on-surface-variant)' }}>
                          Joined {m.joined_at}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card variant="outlined" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <h3 className="m3-title-large" style={{ margin: '0 0 0.45rem', color: 'var(--on-surface)' }}>
                    No Active Roommate Group Yet
                  </h3>
                  <p className="m3-body-medium" style={{ margin: '0 0 1.4rem', color: 'var(--on-surface-variant)', maxWidth: '46ch', marginInline: 'auto' }}>
                    Once mutual roommate invitations are accepted for the same target room configuration, your group roster appears here automatically.
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab('DISCOVER')}>
                    Discover Compatible Peers
                  </Button>
                </Card>
              )}
            </div>
          )}

          {/* TAB 4: PREFERENCES */}
          {activeTab === 'PREFERENCES' && (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <Card variant="outlined" style={{ padding: '1.5rem' }}>
                <div style={{ paddingBottom: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--outline-variant)' }}>
                  <h2 className="m3-title-large" style={{ margin: '0 0 0.3rem', color: 'var(--on-surface)' }}>
                    7-Factor Lifestyle Questionnaire
                  </h2>
                  <p className="m3-body-medium" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
                    Configure your living rhythm across sleep timing, study discipline, cleanliness, guest tolerance, diet, social energy, and thermal preference.
                  </p>
                </div>
                <PreferenceForm initialValues={preferences} onSave={handleSavePreferences} />
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
