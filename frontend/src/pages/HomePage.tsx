import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { applicationsApi } from '../api/applicationsApi';
import { DashboardSummary } from '../types/application';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SkiperCampusTicker } from '../components/ui/skiper-ui/SkiperCampusTicker';
import { SkiperInteractiveBento } from '../components/ui/skiper-ui/SkiperInteractiveBento';
import { Link001, Link004, Link005 } from '../components/ui/skiper-ui/skiper40';
import { EconomicsCalculatorModal } from '../components/economics/EconomicsCalculatorModal';
import {
  Building2,
  Bed,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    applicationsApi.getDashboardSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  const campus = summary?.campus;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F9F8F5]">
      {/* Dynamic Institutional Campus Ticker */}
      <SkiperCampusTicker />

      <main className="container py-10 flex-1">
        {/* Split Asymmetric Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14">
          {/* Left Column: Masthead & Core Directives (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Academic Session & Operational Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide uppercase font-mono text-[11px]">
                Lovely Professional University • Residential Life Portal
              </span>
            </div>

            {/* Authoritative Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-ink leading-[1.12] tracking-tight mb-4">
              Hostel Allocation &amp; Roommate Matching
            </h1>

            <p className="text-base sm:text-lg text-text leading-relaxed mb-6 max-w-2xl">
              Authoritative campus accommodation directory across 14 residential towers (BH-1 to BH-8 and GH-1 to GH-6).
              Transparent 10-month session fee structures, metered electricity quotas with equitable resident allocation,
              Pro Bricks 6-regional mess dining subscriptions, and 7-factor deterministic roommate compatibility.
            </p>

            {/* Tactical Actions */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <Link to="/hostels" className="no-underline">
                <Button variant="primary" size="lg" className="flex items-center gap-2 h-11 px-5 font-semibold text-sm">
                  Explore Campus Hostels <ArrowRight size={17} />
                </Button>
              </Link>

              <Link to="/rooms" className="no-underline">
                <Button variant="secondary" size="lg" className="h-11 px-5 font-semibold text-sm">
                  Browse Room Catalog
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => setIsCalcOpen(true)}
                className="inline-flex items-center gap-2 px-4 h-11 rounded-md border border-orange-200 bg-orange-50 text-orange-900 text-sm font-semibold hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <Sparkles size={16} className="text-brand" />
                Fee &amp; Dining Simulator
              </button>
            </div>

            {/* Skiper Cursor-Inspired Micro-Links */}
            <div className="pt-4 border-t border-stone-200/80 w-full flex flex-wrap items-center gap-6 text-xs text-text-muted font-medium">
              <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">Quick Access:</span>
              <Link001 href="/hostels" className="text-stone-700 hover:text-primary">
                2D CAD Floor Plans
              </Link001>
              <Link004 href="/roommates" className="text-stone-700 hover:text-primary">
                7-Factor Roommate Radar
              </Link004>
              <Link005 href="/dashboard" className="text-stone-700 hover:text-primary">
                Turnstile Gate Passes
              </Link005>
            </div>
          </motion.div>

          {/* Right Column: Live Census & Allocation Digest (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                    Campus Accommodation Census
                  </div>
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    Residential Capacity Roster
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Active Sync
                </Badge>
              </div>

              {/* Census Data Metrics with Clean Logic Grouping */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-stone-100 text-stone-700">
                      <Building2 size={16} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-ink">Active Complexes</div>
                      <div className="text-[11px] text-text-muted">8 Boys &amp; 6 Girls Hostels</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-serif font-semibold text-ink tabular-nums">
                      {campus?.total_hostels ?? 14}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono">Towers BH/GH</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                      <Bed size={16} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-ink">Total Bed Inventory</div>
                      <div className="text-[11px] text-text-muted">1 to 8-Seaters &amp; Studios</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-serif font-semibold text-ink tabular-nums">
                      {campus?.total_beds ?? 1848}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono">AC / Air-Cooled</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-ink">Available Vacancies</div>
                      <div className="text-[11px] text-emerald-700 font-medium">Ready for allocation</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-serif font-semibold text-emerald-700 tabular-nums">
                      {campus?.vacant_beds ?? 1847}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono">Vacant Slots</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
                      <Calendar size={16} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-ink">Academic Session</div>
                      <div className="text-[11px] text-text-muted">10-Month Session Schedule</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-serif font-semibold text-ink">
                      {campus?.active_cycle_name ?? 'AY 2026–27'}
                    </div>
                    <span className="inline-block text-[10px] text-amber-800 font-mono font-medium">
                      Allotment Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Banner inside Digest */}
              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between bg-[#FAF9F6] p-3 rounded-xl">
                <span className="text-xs text-text-muted">
                  Interactive Floor Plan Available
                </span>
                <Link to="/hostels" className="no-underline">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                    <Compass size={13} /> Inspect Blueprint &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Skiper Interactive Bento Showcase */}
        <SkiperInteractiveBento />

        {/* Institutional Guardrails (Logic Grouped, Not 3 Disjointed Floating Cards) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-ink m-0">
              Institutional Living Directives
            </h2>
            <span className="text-xs font-mono text-text-muted">Policy Ref. LPU-RES-2026</span>
          </div>

          <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            {/* Directive 1 */}
            <div className="p-4 md:first:pl-0 md:last:pr-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-orange-50 text-brand">
                  <ShieldCheck size={18} />
                </span>
                <h3 className="text-base font-serif font-semibold text-ink m-0">
                  7-Factor Compatibility
                </h3>
              </div>
              <p className="text-xs text-text leading-relaxed m-0">
                Algorithmic evaluation across sleep schedules (22%), cleanliness (17%), study environment (17%), noise tolerance, dietary preferences, and air-conditioning tolerance. Mandatory same-gender safety with strict non-smoker protections.
              </p>
            </div>

            {/* Directive 2 */}
            <div className="p-4 md:px-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <Zap size={18} />
                </span>
                <h3 className="text-base font-serif font-semibold text-ink m-0">
                  Metered Power Quotas
                </h3>
              </div>
              <p className="text-xs text-text leading-relaxed m-0">
                Transparent allocations from 250 kWh up to 1,000 kWh per 10-month session based on room seater and cooling type. Any consumption beyond assigned quotas is divided equally among room occupants at university cost (₹8.50/unit) without markups.
              </p>
            </div>

            {/* Directive 3 */}
            <div className="p-4 md:first:pl-0 md:last:pr-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-base font-serif font-semibold text-ink m-0">
                  Pro Bricks Dining Plans
                </h3>
              </div>
              <p className="text-xs text-text leading-relaxed m-0">
                Subscribed regional dining across North Indian, South Indian, Rajasthani, Haryanvi, Gujarati, and Eastern cuisines with 2, 3, or 4-meal standard or à la carte meal plans, plus optional laundry and fitness facility access.
              </p>
            </div>
          </div>
        </section>

        {/* University Contraband Safety Banner */}
        <section>
          <div className="p-5 bg-white border border-stone-200 border-l-[3px] border-l-brand rounded-xl flex items-baseline gap-3 shadow-xs">
            <ShieldCheck size={18} className="text-brand shrink-0 mt-0.5" />
            <div className="text-xs text-text leading-relaxed">
              <strong className="text-ink font-semibold">Residential Equipment &amp; Contraband Policy:</strong> Laptops, mobile chargers, electric kettles, hair dryers, and clothes irons are strictly permitted. Immersion heating rods and induction cooktops are contraband and strictly prohibited under Lovely Professional University residential safety guidelines.
            </div>
          </div>
        </section>
      </main>

      {/* Residential Economics Calculator Modal */}
      <EconomicsCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
