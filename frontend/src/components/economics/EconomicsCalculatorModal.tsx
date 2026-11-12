import React, { useState, useEffect } from 'react';
import { livingApi } from '../../api/livingApi';
import { EconomicsCalculationResult, MessCuisineOption } from '../../types/living';
import { X, Calculator, Zap, Utensils, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface EconomicsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeater?: number;
  initialCooling?: string;
}

export const EconomicsCalculatorModal: React.FC<EconomicsCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialSeater = 2,
  initialCooling = 'AIR_CONDITIONED',
}) => {
  const [seater, setSeater] = useState<number>(initialSeater);
  const [cooling, setCooling] = useState<string>(initialCooling);
  const [isEdb, setIsEdb] = useState<boolean>(true);
  const [cuisineId, setCuisineId] = useState<string>('NORTH_INDIAN');
  const [mealPlan, setMealPlan] = useState<string>('FOUR_MEAL');
  const [estimatedKwh, setEstimatedKwh] = useState<number>(750);
  const [calcResult, setCalcResult] = useState<EconomicsCalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Recalculate whenever inputs change
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    livingApi
      .calculateEconomics({
        category: 'STANDARD',
        seater_count: seater,
        cooling_type: cooling,
        is_edb_eligible: isEdb,
        mess_cuisine: cuisineId,
        meal_plan: mealPlan,
        estimated_kwh: estimatedKwh,
      })
      .then((data) => setCalcResult(data))
      .catch((err) => console.error('Economics calculation failed:', err))
      .finally(() => setLoading(false));
  }, [isOpen, seater, cooling, isEdb, cuisineId, mealPlan, estimatedKwh]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--md-sys-color-scrim)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: 'var(--surface-container-high)',
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            border: '1px solid var(--outline-variant)',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '92vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxShadow: 'var(--md-sys-elevation-3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--outline-variant)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--surface-container)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--primary-container)',
                color: 'var(--on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--md-sys-shape-corner-medium)',
              }}
            >
              <Calculator size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--ink)',
                }}
              >
                Residential Economics & Tariff Simulator
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                10-Month Academic Session • LPU Standard Fee, Mess & Metered Power Master
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close fee breakdown simulator"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem' }}>
            {/* Left Column: Configuration Controls */}
            <div>
              {/* Room Tier & Cooling */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Room Seater Configuration:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[1, 2, 3, 4].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeater(s)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.8125rem',
                        fontWeight: seater === s ? 700 : 500,
                        border: `1px solid ${seater === s ? 'var(--primary)' : 'var(--outline-variant)'}`,
                        backgroundColor: seater === s ? 'var(--primary-container)' : 'var(--surface-container-lowest)',
                        color: seater === s ? 'var(--on-primary-container)' : 'var(--on-surface)',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                      }}
                    >
                      {s}-Seater
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooling Mode */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Climate & Cooling:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'AIR_CONDITIONED', label: 'Air Conditioned (AC)' },
                    { id: 'AIR_COOLED', label: 'Air Cooled (Cooler)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCooling(c.id)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.8125rem',
                        fontWeight: cooling === c.id ? 700 : 500,
                        border: `1px solid ${cooling === c.id ? 'var(--primary)' : 'var(--outline-variant)'}`,
                        backgroundColor: cooling === c.id ? 'var(--primary-container)' : 'var(--surface-container-lowest)',
                        color: cooling === c.id ? 'var(--on-primary-container)' : 'var(--on-surface)',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Early Decision Benefit (EDB) */}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--md-sys-color-success-container)',
                  border: '1px solid var(--md-sys-color-success)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} color="var(--md-sys-color-on-success-container)" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--md-sys-color-on-success-container)' }}>
                      Early Decision Benefit (EDB)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--md-sys-color-on-success-container)', opacity: 0.9 }}>
                    Instant ₹10,000 fee waiver for early session commitments.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEdb}
                  onChange={(e) => setIsEdb(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--md-sys-color-success)', cursor: 'pointer' }}
                />
              </div>

              {/* Pro Bricks Mess Cuisine Picker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Pro Bricks Regional Mess Cuisine:
                </label>
                <select
                  value={cuisineId}
                  onChange={(e) => setCuisineId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    border: '1px solid var(--outline)',
                    fontSize: '0.8125rem',
                    backgroundColor: 'var(--surface-container-lowest)',
                    color: 'var(--on-surface)',
                  }}
                >
                  {calcResult?.mess?.available_cuisines.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · ₹{c.monthly_fee}/month
                    </option>
                  )) || (
                    <option value="NORTH_INDIAN">North Indian Royal Feast · ₹4,500/month</option>
                  )}
                </select>
              </div>

              {/* Meal Frequency */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Meal Frequency:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'FOUR_MEAL', label: '4 Meals (Full)' },
                    { id: 'THREE_MEAL', label: '3 Meals' },
                    { id: 'TWO_MEAL', label: '2 Meals' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMealPlan(m.id)}
                      style={{
                        padding: '0.45rem',
                        fontSize: '0.75rem',
                        fontWeight: mealPlan === m.id ? 700 : 500,
                        border: `1px solid ${mealPlan === m.id ? 'var(--primary)' : 'var(--outline-variant)'}`,
                        backgroundColor: mealPlan === m.id ? 'var(--primary-container)' : 'var(--surface-container-lowest)',
                        color: mealPlan === m.id ? 'var(--on-primary-container)' : 'var(--on-surface)',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metered Electricity Slider */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--ink)',
                    }}
                  >
                    Session Electricity Units:
                  </label>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {estimatedKwh} kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="25"
                  value={estimatedKwh}
                  onChange={(e) => setEstimatedKwh(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.2rem',
                  }}
                >
                  <span>Quota: {calcResult?.electricity.quota_kwh ?? 750} kWh (included)</span>
                  <span>Tariff: ₹8.50/unit overage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real-Time Cost Summary & Transparency Breakdown */}
            <div
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-large)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    letterSpacing: '0.08em',
                  }}
                >
                  Session Balance Breakdown
                </span>

                {/* Line Items */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Hostel Room Rent */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text)' }}>
                      10-Month Room Fee ({seater}S {cooling === 'AIR_CONDITIONED' ? 'AC' : 'Cooler'})
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      ₹{calcResult?.pricing.applicable_hostel_fee.toLocaleString('en-IN') ?? '·'}
                    </span>
                  </div>

                  {/* EDB Discount Notice */}
                  {isEdb && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8125rem',
                        color: 'var(--md-sys-color-success)',
                      }}
                    >
                      <span>Early Decision Benefit (EDB)</span>
                      <span style={{ fontWeight: 600 }}>-₹10,000</span>
                    </div>
                  )}

                  {/* Dining Mess Fee */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <div>
                      <span style={{ color: 'var(--text)', display: 'block' }}>
                        Mess Dining (10 Months)
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {calcResult?.mess.cuisine_name} ({calcResult?.mess.meal_plan_label.split('(')[0]})
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      ₹{calcResult?.mess.session_10_month_fee.toLocaleString('en-IN') ?? '·'}
                    </span>
                  </div>

                  {/* Electricity Metered Overage */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                      borderTop: '1px dashed var(--border)',
                      paddingTop: '0.5rem',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text)', display: 'block' }}>
                        Electricity Overage Share
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {calcResult && calcResult.electricity.overage_kwh > 0
                          ? `+${calcResult.electricity.overage_kwh} kWh over quota ÷ ${seater} residents`
                          : 'Within complimentary quota'}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          calcResult && calcResult.electricity.per_resident_share > 0
                            ? 'var(--primary)'
                            : 'var(--md-sys-color-success)',
                      }}
                    >
                      {calcResult && calcResult.electricity.per_resident_share > 0
                        ? `+₹${calcResult.electricity.per_resident_share.toLocaleString('en-IN')}`
                        : '₹0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Annual Cost Stamp */}
              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '2px solid var(--border-strong)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                    }}
                  >
                    Total Projected Cost:
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--ink)',
                    }}
                  >
                    ₹{calcResult?.summary.total_annual_cost.toLocaleString('en-IN') ?? '·'}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.5rem',
                    lineHeight: 1.4,
                  }}
                >
                  * Includes 10-month residence, dining subscription, and metered power allocation.
                  No hidden campus maintenance surcharges.
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Button variant="primary" style={{ width: '100%' }} onClick={onClose}>
                    Apply With This Configuration
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
};

