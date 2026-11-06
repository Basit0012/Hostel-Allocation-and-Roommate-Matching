import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { applicationsApi } from '../api/applicationsApi';
import { DashboardSummary } from '../types/application';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SkiperCampusTicker } from '../components/ui/skiper-ui/SkiperCampusTicker';
import { SkiperInteractiveBento } from '../components/ui/skiper-ui/SkiperInteractiveBento';
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
      {/* Refined Institutional Ticker */}
      <SkiperCampusTicker />

      <main className="container py-10 pb-20 flex-1">
        {/* Split Asymmetric Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          {/* Left Column: Masthead & Core Directives (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Academic Session & Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-4">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide uppercase font-mono text-[11px]">
                Lovely Professional University • Residential Life Portal
              </span>
            </div>

            {/* Authoritative Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-ink leading-[1.14] tracking-tight mb-4">
              Hostel Allocation &amp; Roommate Matching
            </h1>

            <p className="text-sm sm:text-base text-text leading-relaxed mb-6 max-w-2xl">
              Authoritative campus accommodation directory across 14 residential towers (BH-1 to BH-8 and GH-1 to GH-6).
              Transparent 10-month session fee structures, complimentary metered electricity quotas,
              Pro Bricks 6-regional mess dining subscriptions, and 7-factor deterministic roommate compatibility.
            </p>

            {/* Tactical Action Buttons with Identical Heights */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link to="/hostels" className="no-underline">
                <Button variant="primary" size="lg" className="flex items-center gap-2 h-11 px-5 font-semibold text-sm shadow-xs">
                  Explore Campus Hostels <ArrowRight size={16} />
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

            {/* Quick Access Navigation Strip */}
            <div className="pt-3 border-t border-stone-200/80 w-full flex flex-wrap items-center gap-5 text-xs text-text-muted font-medium">
              <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">Quick Access:</span>
              <Link to="/hostels" className="text-stone-700 hover:text-primary transition-colors">
                2D CAD Floor Plans &rarr;
              </Link>
              <Link to="/roommates" className="text-stone-700 hover:text-primary transition-colors">
                7-Factor Roommate Radar &rarr;
              </Link>
              <Link to="/dashboard" className="text-stone-700 hover:text-primary transition-colors">
                Turnstile Gate Passes &rarr;
              </Link>
            </div>
          </div>

          {/* Right Column: Live Census & Allocation Digest (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                    Campus Accommodation Census
                  </div>
                  <h3 className="text-base font-serif font-semibold text-ink m-0 mt-0.5">
                    Residential Capacity Roster
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Active Sync
                </Badge>
              </div>

              {/* 2x2 Census Metrics Grid - Clear, Spacious & Aligned */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Metric 1 */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-text-muted font-semibold">Towers</span>
                    <Building2 size={15} className="text-stone-600" />
                  </div>
                  <div className="text-2xl font-serif font-semibold text-ink tabular-nums">
                    {campus?.total_hostels ?? 14}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">8 Boys, 6 Girls</div>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-text-muted font-semibold">Total Beds</span>
                    <Bed size={15} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-serif font-semibold text-ink tabular-nums">
                    {campus?.total_beds ?? 1848}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">1 to 8-Seaters</div>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 font-semibold">Vacant</span>
                    <CheckCircle2 size={15} className="text-emerald-600" />
                  </div>
                  <div className="text-2xl font-serif font-semibold text-emerald-700 tabular-nums">
                    {campus?.vacant_beds ?? 1847}
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5">Available Now</div>
                </div>

                {/* Metric 4 */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-text-muted font-semibold">Term</span>
                    <Calendar size={15} className="text-amber-600" />
                  </div>
                  <div className="text-base font-serif font-semibold text-ink truncate mt-1">
                    AY 2026–27
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">10-Mo Session</div>
                </div>
              </div>

              {/* Action Banner */}
              <Link to="/hostels" className="no-underline block">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-ink text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Compass size={14} className="text-brand" />
                  Inspect 2D Architectural Floor Plans &rarr;
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Skiper Interactive Bento Showcase */}
        <SkiperInteractiveBento />

        {/* Institutional Living Directives (3 Clean Cards with Generous Spacing) */}
        <section className="my-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-ink m-0">
                Institutional Living Directives
              </h2>
              <p className="text-xs text-text-muted m-0 mt-1">
                Policy reference LPU-RES-2026 • Governing all campus residential accommodations
              </p>
            </div>
            <span className="text-xs font-mono text-text-muted hidden sm:inline">Mandatory Guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Directive 1 */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="p-2 rounded-xl bg-orange-50 text-brand border border-orange-200/60">
                    <ShieldCheck size={20} />
                  </span>
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    7-Factor Compatibility
                  </h3>
                </div>
                <p className="text-xs text-text leading-relaxed m-0">
                  Algorithmic evaluation across sleep schedules (22%), cleanliness (17%), study environment (17%), noise tolerance, dietary preferences, and air-conditioning tolerance. Mandatory same-gender safety with strict non-smoker protections.
                </p>
              </div>
            </div>

            {/* Directive 2 */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                    <Zap size={20} />
                  </span>
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    Metered Power Quotas
                  </h3>
                </div>
                <p className="text-xs text-text leading-relaxed m-0">
                  Transparent complimentary allocations from 250 kWh up to 1,000 kWh per 10-month session based on room seater and cooling type. Any consumption beyond assigned quotas is divided equally among room occupants at university cost (₹8.50/unit) without markups.
                </p>
              </div>
            </div>

            {/* Directive 3 */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    <Sparkles size={20} />
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
          </div>
        </section>

        {/* University Contraband Safety Banner */}
        <section className="mt-8">
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
