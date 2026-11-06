import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { applicationsApi } from '../api/applicationsApi';
import { DashboardSummary } from '../types/application';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SkiperCampusTicker } from '../components/ui/skiper-ui/SkiperCampusTicker';
import { SkiperInteractiveBento } from '../components/ui/skiper-ui/SkiperInteractiveBento';
import { Link001, Link004, Link005 } from '../components/ui/skiper-ui/skiper40';
import { EconomicsCalculatorModal } from '../components/economics/EconomicsCalculatorModal';
import { Building2, Bed, CheckCircle2, Calendar, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    applicationsApi.getDashboardSummary()
      .then(setSummary)
      .catch(() => {});
  }, []);

  const campus = summary?.campus;

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

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 260,
        damping: 24,
      },
    },
  };

  return (
    <div>
      {/* Dynamic Running Campus Ticker using Skiper & Motion */}
      <SkiperCampusTicker />

      <div className="container py-8">
        {/* Institutional Registrar Masthead Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-surface border border-border border-t-4 border-t-brand p-8 md:p-12 mb-10 shadow-sm"
        >
          {/* Subtle background ambient watermark */}
          <div className="absolute -right-10 -bottom-10 pointer-events-none opacity-5 text-ink select-none font-serif text-[180px] leading-none">
            LPU
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Lovely Professional University • Residential Life &amp; Housing Services
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-3xl md:text-5xl font-serif font-semibold text-ink leading-tight tracking-tight mb-4"
            >
              Hostel Management &amp; Roommate Allocation Portal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-base md:text-lg text-text leading-relaxed mb-6"
            >
              Authoritative campus accommodation directory across 14 residential towers (BH-1 to BH-8 and GH-1 to GH-6).
              Transparent 10-month session fee structures, metered electricity quotas with equitable resident allocation,
              Pro Bricks 6-regional dining subscriptions, and 7-factor deterministic roommate compatibility.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-6"
            >
              <Link to="/hostels" className="no-underline">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    Explore Campus Hostels <ArrowRight size={18} />
                  </Button>
                </motion.div>
              </Link>

              <Link to="/rooms" className="no-underline">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="secondary" size="lg">
                    Browse Room Catalog
                  </Button>
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCalcOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-700 text-sm font-semibold hover:bg-orange-500/20 transition-colors cursor-pointer"
              >
                <Sparkles size={16} className="text-orange-600" />
                Fee &amp; Dining Simulator
              </motion.button>
            </motion.div>

            {/* Skiper Quick Micro-links Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="pt-4 border-t border-border flex flex-wrap items-center gap-6 text-xs text-text-muted font-medium"
            >
              <span className="font-semibold text-ink">Quick Access:</span>
              <Link001 href="/hostels" className="text-text hover:text-primary">
                2D Floor Plan Blueprints
              </Link001>
              <Link004 href="/roommates" className="text-text hover:text-primary">
                Roommate Compatibility
              </Link004>
              <Link005 href="/dashboard" className="text-text hover:text-primary">
                Turnstile Gate Passes
              </Link005>
            </motion.div>
          </div>
        </motion.section>

        {/* Campus Census Metrics Grid with Motion Stagger */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-ink m-0">
              Campus Accommodation Overview
            </h2>
            <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Active Complexes
                  </div>
                  <span className="p-1.5 rounded bg-emerald-50 text-emerald-700">
                    <Building2 size={16} />
                  </span>
                </div>
                <div className="text-3xl font-serif font-semibold text-ink leading-tight tabular-nums my-1">
                  {campus?.total_hostels ?? 14}
                </div>
                <div className="text-xs text-text-muted">
                  8 Boys (BH-1 to BH-8) &amp; 6 Girls Hostels (GH-1 to GH-6)
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Total Bed Inventory
                  </div>
                  <span className="p-1.5 rounded bg-blue-50 text-blue-700">
                    <Bed size={16} />
                  </span>
                </div>
                <div className="text-3xl font-serif font-semibold text-ink leading-tight tabular-nums my-1">
                  {campus?.total_beds ?? 1848}
                </div>
                <div className="text-xs text-text-muted">
                  1 to 8-Seaters, AC &amp; Air-Cooled Standard
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Vacant Beds
                  </div>
                  <span className="p-1.5 rounded bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </span>
                </div>
                <div className="text-3xl font-serif font-semibold text-emerald-700 leading-tight tabular-nums my-1">
                  {campus?.vacant_beds ?? 1848}
                </div>
                <div className="text-xs text-text-muted">
                  Available for Immediate Reservation
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Active Session
                  </div>
                  <span className="p-1.5 rounded bg-amber-50 text-amber-700">
                    <Calendar size={16} />
                  </span>
                </div>
                <div className="text-xl font-serif font-semibold text-ink my-2 truncate">
                  {campus?.active_cycle_name ?? 'Academic Year 2026-27'}
                </div>
                <Badge variant="success" size="sm">
                  Applications Open
                </Badge>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Skiper Interactive Bento Grid */}
        <SkiperInteractiveBento />

        {/* Institutional Architecture Highlights */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-ink mb-4">
            Key Institutional Guardrails
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
              <Card hoverable className="h-full">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={20} className="text-brand" />
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    7-Factor Compatibility Guardrail
                  </h3>
                </div>
                <p className="text-sm text-text leading-relaxed m-0">
                  Algorithmic evaluation across sleeping schedules (22%), cleanliness (17%), study environment (17%), noise tolerance, dietary preferences, and air-conditioning tolerance. Mandatory same-gender safety with strict non-smoker protections.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
              <Card hoverable className="h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className="text-amber-600" />
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    Metered Electricity Quotas
                  </h3>
                </div>
                <p className="text-sm text-text leading-relaxed m-0">
                  Transparent allocations from 250 kWh up to 1,000 kWh per 10-month session based on room seater and cooling type. Any consumption beyond assigned quotas is divided equally among room occupants at university cost (₹8.50/unit) without markups.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
              <Card hoverable className="h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-emerald-600" />
                  <h3 className="text-base font-serif font-semibold text-ink m-0">
                    Pro Bricks Dining &amp; Auxiliary Services
                  </h3>
                </div>
                <p className="text-sm text-text leading-relaxed m-0">
                  Subscribed regional dining across North Indian, South Indian, Rajasthani, Haryanvi, Gujarati, and Eastern cuisines with 2, 3, or 4-meal standard or à la carte meal plans, plus optional laundry and fitness facility access.
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* University Compliance Banner */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-5 bg-surface border border-border border-l-4 border-l-brand rounded-xl flex items-baseline gap-4 shadow-xs">
            <div className="text-sm text-text leading-relaxed">
              <strong className="text-ink">Residential Equipment &amp; Contraband Policy:</strong> Laptops, mobile chargers, electric kettles, hair dryers, and clothes irons are strictly permitted. Immersion heating rods and induction cooktops are contraband and strictly prohibited under Lovely Professional University residential safety guidelines.
            </div>
          </div>
        </motion.section>
      </div>

      {/* Residential Economics Calculator Modal */}
      <EconomicsCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
