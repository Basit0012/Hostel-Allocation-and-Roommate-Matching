import React from 'react';
import { Link000, Link001 } from '../ui/skiper-ui/skiper40';
import { ShieldCheck, Zap, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-border bg-surface pt-10 pb-6 text-text">
      <div className="container">
        {/* Main Footer Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border">
          {/* Col 1: Institutional Authority */}
          <div className="md:col-span-1">
            <div className="font-serif font-semibold text-lg text-ink mb-1">
              Lovely Professional University
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Division of Student Welfare • Directorate of Residential Life &amp; Housing Services.
              Administering 14 on-campus residential complexes across 10-month academic sessions.
            </p>
            <div className="space-y-1 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-brand shrink-0" />
                <span>Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-brand shrink-0" />
                <span>Warden Emergency Helpline: +91 1824 517000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-brand shrink-0" />
                <span>housing@lpu.co.in</span>
              </div>
            </div>
          </div>

          {/* Col 2: Residential Towers */}
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-ink mb-3">
              Residential Complexes
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link000 href="/hostels" className="text-text-muted hover:text-ink">
                  Boys Towers (BH-1 to BH-8)
                </Link000>
              </li>
              <li>
                <Link000 href="/hostels" className="text-text-muted hover:text-ink">
                  Girls Towers (GH-1 to GH-6)
                </Link000>
              </li>
              <li>
                <Link000 href="/rooms" className="text-text-muted hover:text-ink">
                  1 to 8-Seater Room Inventory
                </Link000>
              </li>
              <li>
                <Link000 href="/hostels" className="text-text-muted hover:text-ink">
                  2D CAD Blueprint Floor Plans
                </Link000>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Living Services */}
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-ink mb-3">
              Living Operations
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link001 href="/dashboard" className="text-text-muted hover:text-ink">
                  Turnstile Outing Gate Pass
                </Link001>
              </li>
              <li>
                <Link001 href="/dashboard" className="text-text-muted hover:text-ink">
                  RMS Maintenance SLA Helpdesk
                </Link001>
              </li>
              <li>
                <Link001 href="/roommates" className="text-text-muted hover:text-ink">
                  7-Factor Harmony Matching
                </Link001>
              </li>
              <li>
                <Link001 href="/apply" className="text-text-muted hover:text-ink">
                  New Academic Cycle Allotment
                </Link001>
              </li>
            </ul>
          </div>

          {/* Col 4: Pro Bricks & Residential Economics */}
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider text-ink mb-3">
              Dining &amp; Energy Policy
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link000 href="/rooms" className="text-text-muted hover:text-ink">
                  Pro Bricks 6-Regional Mess
                </Link000>
              </li>
              <li>
                <Link000 href="/hostels" className="text-text-muted hover:text-ink">
                  Metered Electricity Tariffs (₹8.50/u)
                </Link000>
              </li>
              <li>
                <Link000 href="/apply" className="text-text-muted hover:text-ink">
                  ₹10,000 Early Decision Benefit
                </Link000>
              </li>
              <li>
                <span className="text-xs text-text-muted block mt-2">
                  <ShieldCheck size={13} className="inline mr-1 text-emerald-600" />
                  Contraband Enforcement: Immersion rods &amp; cooktops strictly barred.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Compliance Strip */}
        <div className="pt-4 flex flex-wrap justify-between items-center gap-3 text-xs text-text-muted">
          <div>
            © {new Date().getFullYear()} Lovely Professional University. All official rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Zap size={12} className="text-amber-500" /> Metered Power Quotas
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" /> Biometric Turnstile Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
