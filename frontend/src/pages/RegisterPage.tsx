import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck, UserPlus } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        student_id: studentId.trim(),
        institutional_email: institutionalEmail.trim(),
        password,
        confirm_password: confirmPassword,
        emergency_contact_name: emergencyName.trim() || undefined,
        emergency_contact_phone: emergencyPhone.trim() || undefined,
      });
      await refreshUser();
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to claim student account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '0.75rem', paddingBottom: '2rem' }}>
      <div className="m3-grid" style={{ alignItems: 'stretch' }}>
        {/* Left Registry Claim Checklist */}
        <div className="m3-span-5" style={{ display: 'flex' }}>
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--surface-container-low)',
              borderRadius: 'var(--md-sys-shape-corner-extra-large, 28px)',
              border: '1px solid var(--outline-variant)',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <span className="m3-eyebrow-pill" style={{ marginBottom: '1rem' }}>
                <UserPlus size={13} />
                ERP Registry Verification
              </span>

              <h1 className="m3-headline-medium" style={{ margin: '0 0 0.65rem', color: 'var(--on-surface)' }}>
                Claim Your Student Account
              </h1>
              <p className="m3-body-medium" style={{ margin: '0 0 1.5rem', color: 'var(--on-surface-variant)', lineHeight: 1.55 }}>
                Your academic roll number must already exist in the official LPU Registrar admissions roster before residential portal access can be provisioned.
              </p>

              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {[
                  {
                    step: '01',
                    title: 'Student ID Match',
                    desc: 'Validated against verified university academic enrollment records.',
                  },
                  {
                    step: '02',
                    title: 'Institutional Domain Binding',
                    desc: 'Pairs your portal session to your official @lpu.in email.',
                  },
                  {
                    step: '03',
                    title: 'Emergency Guardian Telemetry',
                    desc: 'Used by hostel wardens during late-night outing pass checks.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '0.9rem',
                      borderRadius: 'var(--md-sys-shape-corner-large)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--outline-variant)',
                    }}
                  >
                    <span className="m3-badge-step">{item.step}</span>
                    <div>
                      <div className="m3-title-small" style={{ color: 'var(--on-surface)', fontWeight: 700 }}>
                        {item.title}
                      </div>
                      <div className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                color: 'var(--on-surface-variant)',
              }}
            >
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Protected by session CSRF enforcement &amp; strict RBAC.</span>
            </div>
          </div>
        </div>

        {/* Right Claim Form Card */}
        <div className="m3-span-7" style={{ display: 'flex' }}>
          <Card
            variant="elevated"
            style={{
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              width: '100%',
              borderRadius: 'var(--md-sys-shape-corner-extra-large, 28px)',
            }}
          >
            <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>
              <h2 className="m3-headline-small" style={{ margin: '0 0 0.35rem', color: 'var(--on-surface)' }}>
                Activate Scholar Profile
              </h2>
              <p className="m3-body-medium" style={{ margin: '0 0 1.4rem', color: 'var(--on-surface-variant)' }}>
                Enter your university registration number and create your portal password.
              </p>

              {error && (
                <div
                  role="alert"
                  style={{
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    backgroundColor: 'var(--error-container)',
                    color: 'var(--on-error-container)',
                    border: '1px solid var(--outline-variant)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="reg-id" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Student Roll ID *
                    </label>
                    <input
                      id="reg-id"
                      type="text"
                      required
                      className="m3-field-control"
                      placeholder="e.g. 12400010"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Institutional Email *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      className="m3-field-control"
                      placeholder="scholar@lpu.in"
                      value={institutionalEmail}
                      onChange={(e) => setInstitutionalEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="reg-pass" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="reg-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="m3-field-control"
                        style={{ paddingRight: '2.75rem' }}
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{
                          position: 'absolute',
                          right: '0.65rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--on-surface-variant)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          padding: '0.25rem',
                        }}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-confirm" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Confirm Password *
                    </label>
                    <input
                      id="reg-confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="m3-field-control"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label htmlFor="reg-emg-name" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Guardian Name (Optional)
                    </label>
                    <input
                      id="reg-emg-name"
                      type="text"
                      className="m3-field-control"
                      placeholder="Parent / Guardian full name"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-emg-phone" className="m3-label-medium" style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.35rem' }}>
                      Guardian Phone (Optional)
                    </label>
                    <input
                      id="reg-emg-phone"
                      type="tel"
                      className="m3-field-control"
                      placeholder="+91 98XXXXXXXX"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%', marginTop: '0.4rem' }}>
                  Verify &amp; Activate Account
                  <ArrowRight size={17} />
                </Button>
              </form>

              <div
                style={{
                  marginTop: '1.4rem',
                  paddingTop: '1.15rem',
                  borderTop: '1px solid var(--outline-variant)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                  Already activated your institutional credentials?
                </span>
                <Link
                  to="/login"
                  className="m3-label-large"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}
                >
                  Sign In &rarr;
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
