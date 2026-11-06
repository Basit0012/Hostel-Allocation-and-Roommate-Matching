import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Utensils, Wrench, Sparkles, Building2 } from 'lucide-react';
import { Link000 } from './skiper40';

export const SkiperCampusTicker: React.FC = () => {
  const tickerItems = [
    {
      icon: ShieldCheck,
      text: 'Turnstile Gate Pass Network Active: Biometric QR & Parent-Verified Outings',
      linkText: 'Check Gate Pass',
      href: '/dashboard',
      color: 'text-emerald-400',
    },
    {
      icon: Zap,
      text: 'Metered Electricity Quotas: 250–1000 kWh Active Allocation Across BH & GH Towers',
      linkText: 'Fee Simulator',
      href: '/hostels',
      color: 'text-amber-400',
    },
    {
      icon: Utensils,
      text: 'Pro Bricks 6-Regional Mess Service: North, South, Rajasthani, Gujarati, Haryanvi & Eastern Plans',
      linkText: 'Dining Matrix',
      href: '/rooms',
      color: 'text-orange-400',
    },
    {
      icon: Wrench,
      text: 'RMS Maintenance SLA Desk: 4h Emergency, 12h High, 24h Normal Turnaround Priority',
      linkText: 'RMS Status',
      href: '/dashboard',
      color: 'text-blue-400',
    },
    {
      icon: Sparkles,
      text: 'Session 2026-27 Enrollment: ₹10,000 Early Decision Benefit Applied Directly to 10-Month Fee',
      linkText: 'Apply Now',
      href: '/apply',
      color: 'text-brand',
    },
    {
      icon: Building2,
      text: '14 Residential Complexes: BH-1 to BH-8 & GH-1 to GH-6 with 2D Blueprint Floor Plans',
      linkText: 'Explore Towers',
      href: '/hostels',
      color: 'text-emerald-400',
    },
  ];

  // Duplicate items for continuous seamless loop
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden border-b border-border bg-[#151515] text-[#ECE7DF] py-2 text-xs font-mono tracking-wide">
      {/* Visual edge gradient masks for smooth transition */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#151515] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#151515] to-transparent" />

      <motion.div
        className="flex gap-8 whitespace-nowrap will-change-transform"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 35,
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className={`inline-flex items-center justify-center p-1 rounded bg-white/5 ${item.color}`}>
                <Icon size={13} />
              </span>
              <span className="text-stone-300 font-medium">{item.text}</span>
              <span className="text-stone-600 font-bold">•</span>
              <Link000
                href={item.href}
                className="text-stone-200 underline-offset-4 font-semibold text-xs transition-colors hover:text-white"
              >
                {item.linkText}
              </Link000>
              <span className="text-stone-700 ml-3">/</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

