import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Utensils, Wrench, Sparkles, Building2 } from 'lucide-react';
import { Link000 } from './skiper40';

export const SkiperCampusTicker: React.FC = () => {
  const tickerItems = [
    {
      icon: ShieldCheck,
      text: 'Turnstile Gate Pass Network Active: Biometric QR Verified',
      linkText: 'Check Pass',
      href: '/dashboard',
      color: 'text-emerald-400',
    },
    {
      icon: Zap,
      text: 'Metered Electricity Quotas: 250–1000 kWh Active Across Towers',
      linkText: 'Tariff Schedule',
      href: '/hostels',
      color: 'text-amber-400',
    },
    {
      icon: Utensils,
      text: 'Pro Bricks 6-Regional Mess Service: North, South, Rajasthani, Gujarati, Haryanvi, Eastern',
      linkText: 'Dining Matrix',
      href: '/rooms',
      color: 'text-orange-400',
    },
    {
      icon: Wrench,
      text: 'RMS Maintenance SLA Desk: 4h Emergency, 12h High, 24h Normal Turnaround',
      linkText: 'RMS Helpdesk',
      href: '/dashboard',
      color: 'text-blue-400',
    },
    {
      icon: Sparkles,
      text: 'Session 2026-27 Enrollment: ₹10,000 Early Decision Benefit Live',
      linkText: 'Apply Now',
      href: '/apply',
      color: 'text-orange-400',
    },
    {
      icon: Building2,
      text: '14 Residential Complexes: BH-1 to BH-8 & GH-1 to GH-6 with 2D CAD Plans',
      linkText: 'Explore Towers',
      href: '/hostels',
      color: 'text-emerald-400',
    },
  ];

  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden border-b border-[#262626] bg-[#141414] text-stone-300 py-1.5 text-[11px] font-mono tracking-wide select-none">
      {/* Edge gradient masks for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#141414] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#141414] to-transparent" />

      <motion.div
        className="flex gap-8 whitespace-nowrap will-change-transform items-center"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 38,
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0">
              <span className={`inline-flex items-center justify-center p-0.5 rounded ${item.color}`}>
                <Icon size={12} strokeWidth={2.2} />
              </span>
              <span className="text-stone-300 font-normal">{item.text}</span>
              <span className="text-stone-600 font-bold">•</span>
              <Link000
                href={item.href}
                className="text-stone-100 font-semibold underline-offset-4 text-[11px] hover:text-white"
              >
                {item.linkText} &rarr;
              </Link000>
              <span className="text-stone-700 ml-3">/</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
