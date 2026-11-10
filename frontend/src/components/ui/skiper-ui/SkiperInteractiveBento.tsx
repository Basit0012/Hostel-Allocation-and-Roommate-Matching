import React from 'react';
import { motion } from 'motion/react';
import { Compass, Users, QrCode, Wrench, Calculator, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkiperInteractiveBento: React.FC = () => {
  return (
    <section className="my-14">
      {/* Section Header */}
      <div className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-700 border border-orange-500/20 mb-2.5">
          <Sparkles size={13} className="text-brand" />
          Campus Infrastructure
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-ink tracking-tight mb-2">
          Engineered for Campus Living at Scale
        </h2>
        <p className="text-sm text-text-muted leading-relaxed m-0">
          Vector-accurate floor plans, deterministic compatibility scoring, automated SLA maintenance dispatch, and residential economics across 14 university complexes.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: 2D Blueprint Floor Plan (Spans 2 cols on desktop) */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <Compass size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                1:100 CAD Vector Accuracy
              </span>
            </div>

            <h3 className="text-xl font-serif font-semibold text-ink mb-2">
              2D Architectural Blueprint Floor Plan
            </h3>
            <p className="text-sm text-text leading-relaxed mb-5">
              Inspect rooms in real-time with authentic architectural door swing clearance arcs, window fenestrations,
              and individual bed-level availability rosters (<span className="font-mono text-xs font-semibold text-ink">Bed A</span>, <span className="font-mono text-xs font-semibold text-ink">Bed B</span>). Direct reservation prevents allocation conflicts.
            </p>

            {/* Clean Corridor Tags Strip */}
            <div className="flex flex-wrap items-center gap-2 py-3 px-4 rounded-xl bg-stone-50 border border-stone-200/80 mb-6 text-xs font-mono">
              <span className="font-semibold text-ink">Wing Blueprint:</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-700">North: Even Rooms (102–134)</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-700">South: Odd Rooms (101–133)</span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">Core: 4x Elevators &amp; RO</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              14 Residential Complexes Available
            </span>
            <Link to="/hostels" className="no-underline">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                Launch Blueprint Viewer <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Card 2: 7-Factor Roommate Radar */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                <Users size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                Deterministic
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              7-Factor Harmony Radar
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Algorithmic compatibility evaluation across Sleep Schedules (22%), Cleanliness (17%), Study Habits (17%), Noise Tolerance, Diet, Socializing, and AC tolerance.
            </p>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 leading-normal mb-4">
              Strict non-smoker protection with mandatory same-gender safety constraints.
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link to="/roommates" className="no-underline">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                Match Peer Roommates <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Card 3: Outing Gate Pass with Turnstile QR */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                <QrCode size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                Encrypted QR
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              Turnstile Outing Pass
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Day Passes, Night Outs, and Leaves verified through warden approvals and encrypted biometric turnstile QR tokens with automatic parent SMS logs.
            </p>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 leading-normal mb-4">
              Automated curfew tracking (9:00 PM standard return cutoff).
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link to="/dashboard" className="no-underline">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                Digital Gate Pass Desk <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Card 4: RMS Maintenance SLA Clocks */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200/60">
                <Wrench size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200/60">
                Strict SLA Clocks
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              RMS Maintenance SLA
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              4h Emergency (Electrical/Water leak), 12h High, and 24h Normal turnaround with live countdown clocks and automated supervisory warden dispatch.
            </p>

            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 leading-normal mb-4">
              Electrical, Plumbing, Carpentry, and HVAC dispatch desks.
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <Link to="/dashboard" className="no-underline">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                Track RMS Tickets <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>

        {/* Card 5: Residential Economics & 6-Regional Mess (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200/90 bg-white p-7 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-2 rounded-xl bg-orange-50 text-orange-800 border border-orange-200/60">
                    <Calculator size={18} />
                  </span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                    ₹10,000 Early Benefit Active
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-ink mb-1.5">
                  Residential Economics &amp; 6-Regional Mess
                </h3>
                <p className="text-xs sm:text-sm text-text max-w-lg leading-relaxed mb-0">
                  Calculate 10-month session costs across 1 to 8-Seaters, Air-Cooled vs. Air-Conditioned
                  units, transparent metered electricity overages (₹8.50/kWh split equally among residents), and 6 regional cuisines.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/80 shrink-0 text-center sm:min-w-[170px]">
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-mono font-semibold">10-Mo Session Fee</div>
                <div className="text-2xl font-serif font-bold text-primary my-0.5">₹1,15,000*</div>
                <div className="text-[10px] text-emerald-800 font-medium">Includes ₹10k Early Savings</div>
              </div>
            </div>

            {/* Regional Dining Badges */}
            <div className="flex flex-wrap items-center gap-2 py-2.5 px-3 rounded-xl bg-stone-50 border border-stone-200/70 mb-4 text-xs">
              <span className="font-semibold text-ink text-[11px] font-mono">Cuisines:</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">North Indian</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">South Indian</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">Rajasthani</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">Gujarati</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">Haryanvi</span>
              <span className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">Eastern</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              Complimentary 250–1000 kWh quota included per room
            </span>
            <Link to="/hostels" className="no-underline">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover">
                Launch Tariff Simulator <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
