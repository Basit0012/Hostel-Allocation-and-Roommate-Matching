import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Eye, EyeOff, KeyRound, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { RippleOverlay, useM3Ripple } from '../components/common/Ripple';

const DEMO_ACCOUNTS = [
  { label: 'Student (12400001)', id: '12400001' },
  { label: 'Warden (Boys)', id: 'warden.boys@lpu.in' },
  { label: 'University Admin', id: 'admin@lpu.in' },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { ripples, triggerRipple } = useM3Ripple();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid institutional credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyDemoAccount = (id: string) => {
    setIdentifier(id);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="container" style={{ paddingTop: '0.75rem', paddingBottom: '2rem' }}>
      <div className="m3-grid" style={{ alignItems: 'stretch' }}>
        {/* Left Institutional Showcase Panel */}
        <div className="m3-span-5" style={{ display: 'flex' }}>
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--primary-container)',
              color: 'var(--on-primary-container)',
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
              <span
                className="m3-label-large"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.28rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={14} />
                LPU Institutional SSO
              </span>

              <h1 className="m3-headline-medium" style={{ margin: '0 0 0.65rem', color: 'var(--on-primary-container)' }}>
                Residential Allocation Portal
              </h1>
              <p className="m3-body-medium" style={{ margin: '0 0 1.4rem', opacity: 0.9, lineHeight: 1.55 }}>
                Sign in with your verified LPU Student Roll ID or institutional email to access CAD wing floor plans, peer matching, outing passes, and warden allotment status.
              </p>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  { icon: Building2, text: 'Inspect all 14 campus complexes (BH-1–8 & GH-1–6)' },
                  { icon: Users, text: 'Lock mutual 7-factor roommate compatibility groups' },
                  { icon: KeyRound, text: 'Access digital Outing Gate Passes & RMS maintenance desk' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.7rem',
                        padding: '0.7rem 0.85rem',
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--on-surface)',
                        border: '1px solid var(--outline-variant)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                      }}
                    >
                      <Icon size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Demo Quick-Fill */}
            <div
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--outline-variant)',
              }}
            >
              <div className="m3-label-small" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.55rem' }}>
                Quick-Fill Sandbox Accounts (Password123!)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    className={`m3-chip ${identifier === acc.id ? 'is-active' : ''}`}
                    onPointerDown={triggerRipple}
                    onClick={() => applyDemoAccount(acc.id)}
                  >
                    <RippleOverlay ripples={ripples} color="var(--md-sys-ripple-color)" />
                    <span style={{ position: 'relative', zIndex: 1 }}>{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sign-In Form Card */}
        <div className="m3-span-7" style={{ display: 'flex' }}>
          <Card
            variant="elevated"
            style={{
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              width: '100%',
              borderRadius: 'var(--md-sys-shape-corner-extra-large, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>
              <h2 className="m3-headline-small" style={{ margin: '0 0 0.35rem', color: 'var(--on-surface)' }}>
                Sign In to Your Account
              </h2>
              <p className="m3-body-medium" style={{ margin: '0 0 1.5rem', color: 'var(--on-surface-variant)' }}>
                Authenticate using your LPU Registration ID or `@lpu.in` email address.
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

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.15rem' }}>
                <div>
                  <label
                    htmlFor="login-identifier"
                    className="m3-label-medium"
                    style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.4rem' }}
                  >
                    Student ID or Institutional Email
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    className="m3-field-control"
                    placeholder="e.g. 12400001 or name@lpu.in"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="m3-label-medium"
                    style={{ display: 'block', color: 'var(--on-surface)', marginBottom: '0.4rem' }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="m3-field-control"
                      style={{ paddingRight: '2.75rem' }}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%', marginTop: '0.35rem' }}>
                  Sign In
                  <ArrowRight size={17} />
                </Button>
              </form>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--outline-variant)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span className="m3-body-small" style={{ color: 'var(--on-surface-variant)' }}>
                  Admitted scholar claiming portal access?
                </span>
                <Link
                  to="/register"
                  className="m3-label-large"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}
                >
                  Claim Account &rarr;
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
