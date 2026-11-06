import React from 'react';
import { motion } from 'motion/react';
import { Compass, Users, QrCode, Wrench, Calculator, Sparkles, Bed, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link001, Link004, Link005 } from './skiper40';

export const SkiperInteractiveBento: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 240,
        damping: 24,
      },
    },
  };

  return (
    <motion.section
      className="my-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-700 border border-orange-500/20 mb-2.5">
            <Sparkles size={12} className="text-brand animate-pulse" />
            Core Living Infrastructure
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-ink tracking-tight m-0">
            Engineered for Campus Living at Scale
          </h2>
        </div>
        <p className="text-sm text-text-muted max-w-lg m-0 leading-relaxed">
          Vector-accurate floor plans, deterministic compatibility scoring, automated SLA maintenance dispatch, and residential economics for 14 residential towers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Card 1: 2D Blueprint Floor Plan (Spans 2 cols) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="md:col-span-2 relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <Compass size={22} />
              </span>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                1:100 CAD Vector Accuracy
              </span>
            </div>

            <h3 className="text-xl font-serif font-semibold text-ink mb-2">
              2D Architectural Blueprint Floor Plan
            </h3>
            <p className="text-sm text-text leading-relaxed mb-6">
              Inspect rooms in real-time with authentic architectural door swing clearance arcs, window fenestrations,
              and individual bed-level availability rosters (<span className="font-mono text-xs font-semibold">Bed A</span>, <span className="font-mono text-xs font-semibold">Bed B</span>). Direct reservation prevents booking race conditions.
            </p>

            {/* Micro Blueprint Architectural Preview */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80 mb-6 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-stone-200/70 text-center">
                <div className="text-[10px] text-text-muted uppercase">North Corridor</div>
                <div className="font-serif font-semibold text-ink text-sm mt-0.5">Even Units</div>
                <div className="text-[10px] text-emerald-700 font-sans mt-0.5">Rooms 102–134</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-stone-200/70 text-center">
                <div className="text-[10px] text-text-muted uppercase">Central Core</div>
                <div className="font-serif font-semibold text-ink text-sm mt-0.5">4x Elevators</div>
                <div className="text-[10px] text-text-muted font-sans mt-0.5">RO Water Alcove</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-stone-200/70 text-center">
                <div className="text-[10px] text-text-muted uppercase">South Corridor</div>
                <div className="font-serif font-semibold text-ink text-sm mt-0.5">Odd Units</div>
                <div className="text-[10px] text-emerald-700 font-sans mt-0.5">Rooms 101–133</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              14 Residential Towers Available
            </div>
            <Link001 href="/hostels" className="text-sm font-semibold text-primary hover:text-primary-hover">
              Launch Blueprint Viewer
            </Link001>
          </div>
        </motion.div>

        {/* Card 2: 7-Factor Roommate Radar */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                <Users size={22} />
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/60">
                Deterministic
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              7-Factor Harmony Radar
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Algorithmic compatibility evaluation across Sleep Schedules (22%), Cleanliness (17%), Study Habits (17%), Noise Tolerance, Diet, Socializing, and AC tolerance.
            </p>

            <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 leading-normal mb-4">
              Strict non-smoker protection with mandatory same-gender safety constraints.
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <Link004 href="/roommates" className="text-xs font-semibold text-primary hover:text-primary-hover">
              Match Peer Roommates
            </Link004>
          </div>
        </motion.div>

        {/* Card 3: Outing Gate Pass with Turnstile QR */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                <QrCode size={22} />
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                Encrypted QR
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              Turnstile Outing Pass
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Day Passes, Night Outs, and Leaves verified through warden approvals and encrypted biometric turnstile QR tokens with automatic parent SMS logs.
            </p>

            <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-[11px] text-amber-900 leading-normal mb-4">
              Automated curfew tracking (9:00 PM standard return cutoff).
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <Link005 href="/dashboard" className="text-xs font-semibold text-primary hover:text-primary-hover">
              Digital Gate Pass Desk
            </Link005>
          </div>
        </motion.div>

        {/* Card 4: RMS Maintenance SLA Clocks */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200/60">
                <Wrench size={22} />
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/60">
                Strict Turnaround
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              RMS Maintenance SLA
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              4h Emergency (Electrical/Water leak), 12h High, and 24h Normal turnaround with live countdown clocks and automated supervisory warden dispatch.
            </p>

            <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-[11px] text-rose-900 leading-normal mb-4">
              Electrical, Plumbing, Carpentry, and HVAC dispatch desks.
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <Link001 href="/dashboard" className="text-xs font-semibold text-primary hover:text-primary-hover">
              Track Active RMS Tickets
            </Link001>
          </div>
        </motion.div>

        {/* Card 5: Residential Economics & 6-Regional Mess (Spans 3 cols on large) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="md:col-span-2 lg:col-span-3 relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between group"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-2 rounded-xl bg-orange-50 text-orange-800 border border-orange-200/60">
                  <Calculator size={20} />
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
                  ₹10,000 Early Benefit Active
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-ink mb-1.5">
                Residential Economics &amp; 6-Regional Mess Dining Simulator
              </h3>
              <p className="text-sm text-text max-w-xl leading-relaxed">
                Calculate total 10-month session costs across 1 to 8-Seaters, Air-Cooled vs. Air-Conditioned
                units, transparent metered electricity overages (₹8.50/kWh split equally among residents), and 6 regional cuisines.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/80 shrink-0 text-center min-w-[180px]">
              <div className="text-[11px] text-text-muted uppercase tracking-wider font-mono">Net 10-Mo Session</div>
              <div className="text-2xl font-serif font-semibold text-primary mt-1">₹1,15,000*</div>
              <div className="text-[11px] text-emerald-800 font-mono mt-0.5">Includes ₹10k Early Savings</div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted font-medium">
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">North Indian</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">South Indian</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">Rajasthani</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">Gujarati</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">Haryanvi</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">Eastern</span>
            </div>
            <Link004 href="/hostels" className="text-sm font-semibold text-primary hover:text-primary-hover">
              Launch Tariff Simulator &rarr;
            </Link004>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
