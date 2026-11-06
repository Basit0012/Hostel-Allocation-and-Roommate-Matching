import React from 'react';
import { motion } from 'motion/react';
import { Compass, Users, QrCode, Wrench, Calculator, ChevronRight, Sparkles } from 'lucide-react';
import { Link001, Link004, Link005 } from './skiper40';

export const SkiperInteractiveBento: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 24,
      },
    },
  };

  return (
    <motion.section
      className="my-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-600 border border-orange-500/20 mb-2">
            <Sparkles size={12} className="animate-spin text-orange-500" style={{ animationDuration: '6s' }} />
            Next-Gen Residential Life Systems
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-ink tracking-tight m-0">
            Engineered for Campus Living at Scale
          </h2>
        </div>
        <p className="text-sm text-text-muted max-w-md m-0">
          Powered by high-precision vector blueprints, deterministic compatibility algorithms, and automated residential services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Card 1: 2D Blueprint Floor Plan (Spans 2 cols) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="md:col-span-2 relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#FAF8F5] to-[#F1EDE4] p-6 shadow-sm flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Compass size={120} className="text-ink" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Compass size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                CAD Accuracy • No 3D Bloat
              </span>
            </div>
            <h3 className="text-xl font-serif font-semibold text-ink mb-2">
              Vector 2D Architectural Floor Plan
            </h3>
            <p className="text-sm text-text leading-relaxed mb-4">
              Inspect rooms in real-time with authentic architectural door swing clearance arcs, window lintel orientations,
              and per-bed occupancy rosters (`Bed A`, `Bed B`). Direct bed-level reservation prevents booking conflicts.
            </p>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              14 Towers Available
            </div>
            <Link001 href="/hostels" className="text-sm font-semibold text-ink group-hover:text-primary">
              Launch Blueprint Viewer
            </Link001>
          </div>
        </motion.div>

        {/* Card 2: 7-Factor Roommate Radar */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#FAF8F5] to-[#F1EDE4] p-6 shadow-sm flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                <Users size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Deterministic
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              7-Factor Harmony Radar
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Algorithmic matching across Sleep (22%), Cleanliness (17%), Study Habits (17%), Noise, Diet, Socializing, and AC tolerance with automatic clash warnings.
            </p>
          </div>

          <div className="pt-3 border-t border-border/60">
            <Link004 href="/roommates" className="text-xs font-semibold text-ink">
              Match Roommates
            </Link004>
          </div>
        </motion.div>

        {/* Card 3: Outing Gate Pass with Turnstile QR */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#FAF8F5] to-[#F1EDE4] p-6 shadow-sm flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <QrCode size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Live QR Tokens
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              Turnstile Outing Pass
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              Day Passes, Night Outs, and Leaves verified through warden approvals and encrypted biometric turnstile QR tokens with automatic parent notification logs.
            </p>
          </div>

          <div className="pt-3 border-t border-border/60">
            <Link005 href="/dashboard" className="text-xs font-semibold text-ink">
              Gate Pass Desk
            </Link005>
          </div>
        </motion.div>

        {/* Card 4: RMS Maintenance SLA Clocks */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#FAF8F5] to-[#F1EDE4] p-6 shadow-sm flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <Wrench size={22} />
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Strict SLA Clocks
              </span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ink mb-2">
              RMS Maintenance
            </h3>
            <p className="text-xs text-text leading-relaxed mb-4">
              4h Emergency (Electrical/Water leak), 12h High, and 24h Normal turnaround with live countdown clocks and automated supervisory warden dispatch.
            </p>
          </div>

          <div className="pt-3 border-t border-border/60">
            <Link001 href="/dashboard" className="text-xs font-semibold text-ink">
              Track RMS SLA
            </Link001>
          </div>
        </motion.div>

        {/* Card 5: Residential Economics & 6-Regional Mess (Spans 3 cols or 2 cols) */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="md:col-span-2 lg:col-span-3 relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-[#1C1C1C] to-[#2B2B2B] text-white p-6 shadow-sm flex flex-col justify-between group"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Calculator size={20} />
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                  ₹10,000 Early Benefit Active
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-white mb-1">
                Residential Economics &amp; 6-Regional Mess Dining Simulator
              </h3>
              <p className="text-sm text-stone-300 max-w-xl">
                Real-time 10-month session cost breakdown across Seater type (1 to 8-Seaters), Air-Cooled vs. Air-Conditioned
                units, transparent metered electricity overages (₹8.50/kWh), and 6 regional cuisines.
              </p>
            </div>

            <div className="bg-white/10 p-3 rounded-lg border border-white/10 shrink-0 text-center">
              <div className="text-xs text-stone-400 uppercase tracking-wider font-mono">Net 10-Mo Session</div>
              <div className="text-2xl font-serif font-semibold text-orange-400 mt-0.5">₹1,15,000*</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Includes ₹10k Early Savings</div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span>• North / South / Rajasthani</span>
              <span>• Gujarati / Haryanvi / Eastern</span>
              <span>• 250–1000 kWh Electricity Quota</span>
            </div>
            <Link004 href="/hostels" className="text-sm font-semibold text-white">
              Launch Interactive Simulator
            </Link004>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
