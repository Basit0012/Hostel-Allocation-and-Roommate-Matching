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
      color: 'text-emerald-700 bg-emerald-100/80',
    },
    {
      icon: Zap,
      text: 'Metered Electricity Quotas: 250–1000 kWh Complimentary Allocation Across Towers',
      linkText: 'Tariff Schedule',
      href: '/hostels',
      color: 'text-amber-800 bg-amber-100/80',
    },
    {
      icon: Utensils,
      text: 'Pro Bricks 6-Regional Mess Service: North, South, Rajasthani, Gujarati, Haryanvi & Eastern Plans',
      linkText: 'Dining Matrix',
      href: '/rooms',
      color: 'text-orange-800 bg-orange-100/80',
    },
    {
      icon: Wrench,
      text: 'RMS Maintenance SLA Desk: 4h Emergency, 12h High, 24h Normal Turnaround Guarantee',
      linkText: 'RMS Helpdesk',
      href: '/dashboard',
      color: 'text-blue-800 bg-blue-100/80',
    },
    {
      icon: Sparkles,
      text: 'Session 2026-27 Allotment: ₹10,000 Early Decision Benefit Applied Directly to 10-Month Fee',
      linkText: 'Apply Online',
      href: '/apply',
      color: 'text-orange-900 bg-orange-100',
    },
    {
      icon: Building2,
      text: '14 Residential Complexes: BH-1 to BH-8 & GH-1 to GH-6 with 2D Vector CAD Blueprint Plans',
      linkText: 'Explore Towers',
      href: '/hostels',
      color: 'text-emerald-800 bg-emerald-100/80',
    },
  ];

  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative w-full overflow-hidden border-b border-[#E3DFD5] bg-[#F3EFE6] text-[#3D3A35] py-2 text-xs font-mono tracking-wide select-none">
      {/* Edge gradient masks for smooth fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#F3EFE6] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#F3EFE6] to-transparent" />

      <motion.div
        className="flex gap-8 whitespace-nowrap will-change-transform items-center"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 40,
        }}
      >
        {duplicatedItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className={`inline-flex items-center justify-center p-1 rounded-md ${item.color}`}>
                <Icon size={13} strokeWidth={2} />
              </span>
              <span className="text-stone-700 font-medium">{item.text}</span>
              <span className="text-stone-400 font-bold">•</span>
              <Link000
                href={item.href}
                className="text-primary font-semibold underline-offset-4 text-xs hover:text-primary-hover"
              >
                {item.linkText} &rarr;
              </Link000>
              <span className="text-stone-300 ml-3">/</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
