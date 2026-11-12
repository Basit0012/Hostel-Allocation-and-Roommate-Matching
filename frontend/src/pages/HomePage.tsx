import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BedDouble,
  Building2,
  Calculator,
  FileCheck2,
  Info,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationsApi } from '../api/applicationsApi';
import { roommatesApi } from '../api/roommatesApi';
import type { DashboardSummary, HostelApplicationItem } from '../types/application';
import type { RoommateGroupData } from '../types/roommate';
import { StudentStageRail } from '../components/allocation/StudentStageRail';
import { EconomicsCalculatorModal } from '../components/economics/EconomicsCalculatorModal';
import { ContinuousTabs } from '../components/watermelon/ContinuousTabs';
import { CardSplitAccordion, type AccordionItemData } from '../components/watermelon/CardSplitAccordion';
import {
  HOSTEL_POLICY_STATUS,
  PROHIBITED_APPLIANCES,
  PROHIBITED_POLICY_NOTE,
} from '../constants/hostelRules';

const SAMPLE_REFERENCE_TIERS = [
  {
    code: 'Studio 1S AC',
    roomType: 'Private Pantry & Washroom',
    standardFee: 120000,
    edbFee: 110000,
    quotaKwh: 1000,
    href: '/rooms?seater=1&cooling=AC',
  },
  {
    code: 'Standard 2S AC',
    roomType: 'Twin Room. Attached Bath',
    standardFee: 110000,
    edbFee: 100000,
    quotaKwh: 750,
    href: '/rooms?seater=2&cooling=AC',
  },
  {
    code: 'Standard 4S Cooler',
    roomType: 'Quad Room. Desert Cooler',
    standardFee: 72000,
    edbFee: 62000,
    quotaKwh: 300,
    href: '/rooms?seater=4&cooling=COOLER',
  },
] as const;

const DINING_PLANS = [
  { name: 'North Indian Royal Feast', monthlyFee: 4500 },
  { name: 'South Indian Traditional', monthlyFee: 4400 },
  { name: 'Rajasthani Marwari Thali', monthlyFee: 4600 },
  { name: 'Kathiyawadi & Gujarati Sattvik', monthlyFee: 4400 },
  { name: 'Haryanvi Desi Diet', monthlyFee: 4600 },
  { name: 'Eastern & Bengali Coastal', monthlyFee: 4800 },
] as const;

const ROOMMATE_FACTORS = [
  { name: 'Sleep schedule', weight: 22 },
  { name: 'Cleanliness', weight: 17 },
  { name: 'Study habits', weight: 17 },
  { name: 'Noise tolerance', weight: 11 },
  { name: 'Dietary habit', weight: 11 },
  { name: 'Social preference', weight: 11 },
  { name: 'AC temperature', weight: 11 },
] as const;

export const HomePage: React.FC = () => {
  const { user, isAuthenticated, isStudent } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [latestApp, setLatestApp] = useState<HostelApplicationItem | null>(null);
  const [roommateGroup, setRoommateGroup] = useState<RoommateGroupData | null>(null);
  const [referenceTab, setReferenceTab] = useState<'tiers' | 'dining' | 'matching'>('tiers');
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    let active = true;

    applicationsApi
      .getDashboardSummary()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch(() => {});

    if (isAuthenticated && isStudent) {
      Promise.allSettled([
        applicationsApi.getApplications(),
        roommatesApi.getGroup(),
      ]).then(([appsResult, groupResult]) => {
        if (!active) return;
        if (appsResult.status === 'fulfilled') {
          setLatestApp(appsResult.value.applications[0] ?? null);
        }
        if (groupResult.status === 'fulfilled') {
          setRoommateGroup(groupResult.value.group ?? null);
        }
      });
    } else {
      setLatestApp(null);
      setRoommateGroup(null);
    }

    return () => {
      active = false;
    };
  }, [isAuthenticated, isStudent]);

  const campus = summary?.campus;
  const student = user?.student;
  const activeAlloc = student?.active_allocation;

  const primaryCta = (() => {
    if (!isAuthenticated) {
      return { label: 'Sign In to Apply (Up to 3 Choices)', to: '/login' };
    }
    if (isStudent) {
      if (activeAlloc) {
        return { label: 'View Allocation & RMS Desk', to: '/dashboard' };
      }
      if (latestApp) {
        return { label: 'Review Priority Application', to: '/apply' };
      }
      return { label: 'Start Priority Application', to: '/apply' };
    }
    return { label: 'Open Warden & Admin Desk', to: '/dashboard' };
  })();

  const statusHeadline = (() => {
    if (!isAuthenticated) {
      return 'Explore campus hostel wings and submit up to 3 prioritized room choices.';
    }
    if (isStudent) {
      if (activeAlloc) {
        return `Allocated to ${activeAlloc.hostel_code} Room ${activeAlloc.room_number}, Bed ${activeAlloc.bed_identifier}.`;
      }
      if (latestApp) {
        return `Priority application status: ${latestApp.status_display} (${latestApp.choices.length} of 3 choices recorded).`;
      }
      return 'Enrollment verified. Select up to 3 ordered room preferences to enter warden review.';
    }
    return `Signed in as ${user?.student?.full_name || user?.student_id_login || user?.email || 'Staff Member'} (${user?.role || 'STAFF'}).`;
  })();

  const accordionItems: AccordionItemData[] = [
    {
      id: 'appliances',
      title: 'Prohibited Heating Appliances Notice',
      badge: HOSTEL_POLICY_STATUS,
      icon: <ShieldAlert size={16} />,
      content: (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {PROHIBITED_APPLIANCES.map((item) => (
              <span
                key={item.id}
                title={item.reason}
                className="inline-flex items-center rounded-md border border-[var(--danger-border)] bg-[var(--danger-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--danger-ink)]"
              >
                {item.label}
              </span>
            ))}
          </div>
          <p className="m-0 text-xs text-muted-foreground">{PROHIBITED_POLICY_NOTE}</p>
        </div>
      ),
    },
    {
      id: 'priority-engine',
      title: 'Priority Choice Allocation Model (No v1 Seat Locking)',
      badge: 'Max 3 Choices',
      icon: <FileCheck2 size={16} />,
      content:
        'Applicants inspect wings on the 2D CAD floor plan or room catalog and rank up to 3 room choices. There is no real-time seat lock countdown in v1; wardens review ranked choices per intake cycle.',
    },
    {
      id: 'fee-untracked',
      title: 'Fee Settlement & Post-Fee Confirmation State',
      badge: 'Not tracked yet',
      icon: <AlertTriangle size={16} />,
      content:
        'Stages 06 (Fee) and 07 (Confirmed) currently report "Not tracked yet" because backend APIs do not expose fee ledger payment or post-fee check-in confirmation records yet.',
    },
    {
      id: 'roommate-contract',
      title: 'Roommate Compatibility API Contract',
      badge: '7 Factors',
      icon: <Info size={16} />,
      content:
        'Candidate discovery computes a single combined percentage compatibility score and room alignment flag across 7 preference factors. Per-factor scores and dealbreakers are omitted unless exposed by backend endpoints.',
    },
  ];

  return (
    <div className="container flex flex-col gap-5">
      {/* Top Status Notice Header (One Primary CTA) */}
      <section
        aria-labelledby="student-home-heading"
        className="rounded-xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Notice Board
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] font-medium text-accent-text">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-brand" aria-hidden="true" />
              Seeded Demo Data
            </span>
          </div>
          {campus?.active_cycle_name && (
            <span className="font-mono text-xs font-medium text-muted-foreground">
              Cycle: {campus.active_cycle_name}
            </span>
          )}
        </div>

        <h1
          id="student-home-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
        >
          {statusHeadline}
        </h1>

        <p className="mt-2 max-w-[68ch] text-sm text-muted-foreground">
          Inspect CAD floor plans and room capacities, optionally form a 7-factor roommate group,
          and submit up to 3 prioritized room preferences for cycle review.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Link to={primaryCta.to} className="notice-cta-primary">
            <span>{primaryCta.label}</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link to="/hostels" className="notice-link-secondary">
            <Building2 size={15} aria-hidden="true" />
            <span>Open 2D CAD Floor Plans</span>
          </Link>
          <Link to="/rooms" className="notice-link-secondary">
            <BedDouble size={15} aria-hidden="true" />
            <span>Room Catalog</span>
          </Link>
          {isAuthenticated && isStudent && (
            <Link to="/roommates" className="notice-link-secondary">
              <Users size={15} aria-hidden="true" />
              <span>Roommate Match</span>
            </Link>
          )}
        </div>
      </section>

      {/* Live 7-Stage Progress Rail + Watermelon StepIndicator */}
      <StudentStageRail
        isAuthenticated={isAuthenticated}
        user={user}
        summary={summary}
        latestApp={latestApp}
        roommateGroup={roommateGroup}
      />

      {/* Split Workspace: Inventory / Priority Choices + Campus Info */}
      <div className="student-home-split">
        <div className="flex flex-col gap-4">
          {/* Campus Vacancy Inventory (Live API /api/applications/summary/) */}
          <section aria-labelledby="inventory-heading" className="py-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3">
              <div>
                <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Campus Capacity
                </span>
                <h2 id="inventory-heading" className="mt-0.5 text-base font-semibold text-foreground">
                  Live bed & room inventory
                </h2>
              </div>
              <Link
                to="/hostels"
                className="text-xs font-semibold text-accent-text hover:underline"
              >
                Inspect by block
              </Link>
            </div>

            <div className="inventory-summary-grid">
              {[
                { label: 'Hostels', value: campus ? String(campus.total_hostels) : 'Loading' },
                { label: 'Total Rooms', value: campus ? campus.total_rooms.toLocaleString() : 'Loading' },
                {
                  label: 'Vacant Beds',
                  value: campus ? campus.vacant_beds.toLocaleString() : 'Loading',
                  highlight: Boolean(campus && campus.vacant_beds > 0),
                },
                { label: 'Total Beds', value: campus ? campus.total_beds.toLocaleString() : 'Loading' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-3.5"
                >
                  <div className="font-mono text-[11px] font-medium text-muted-foreground uppercase">
                    {stat.label}
                  </div>
                  <div
                    className={`mt-1 font-mono text-lg font-bold tabular-nums ${
                      stat.highlight ? 'text-accent-text' : 'text-foreground'
                    }`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Watermelon ContinuousTabs Reference Section */}
          <section
            aria-labelledby="reference-tabs-heading"
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <div>
                <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Reference Tables (Seeded)
                </span>
                <h2 id="reference-tabs-heading" className="mt-0.5 text-base font-semibold text-foreground">
                  Fee tiers, dining plans & match weights
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCalcOpen(true)}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Calculator size={14} />
                <span>Fee Simulator</span>
              </button>
            </div>

            <ContinuousTabs
              value={referenceTab}
              onChange={(id) => setReferenceTab(id as 'tiers' | 'dining' | 'matching')}
              tabs={[
                { id: 'tiers', label: 'Room Tiers' },
                { id: 'dining', label: 'Dining Plans' },
                { id: 'matching', label: '7-Factor Weights' },
              ]}
            />

            <div className="mt-4 overflow-x-auto border-t border-border pt-2">
              {referenceTab === 'tiers' && (
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <th className="px-3 py-2.5">Room Tier</th>
                      <th className="px-3 py-2.5 text-right">Standard</th>
                      <th className="px-3 py-2.5 text-right">EDB Early</th>
                      <th className="px-3 py-2.5 text-right">kWh Quota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SAMPLE_REFERENCE_TIERS.map((tier) => (
                      <tr key={tier.code} className="hover:bg-muted/40">
                        <td className="px-3 py-2.5">
                          <Link
                            to={tier.href}
                            className="font-semibold text-foreground hover:text-accent-text hover:underline"
                          >
                            {tier.code}
                          </Link>
                          <div className="text-xs text-muted-foreground">{tier.roomType}</div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-foreground">
                          INR {tier.standardFee.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold tabular-nums text-accent-text">
                          INR {tier.edbFee.toLocaleString('en-IN')}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                          {tier.quotaKwh}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {referenceTab === 'dining' && (
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <th className="px-3 py-2.5">Dining Plan (Pro-Bricks Reference)</th>
                      <th className="px-3 py-2.5 text-right">Monthly Estimate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {DINING_PLANS.map((plan) => (
                      <tr key={plan.name} className="hover:bg-muted/40">
                        <td className="px-3 py-2.5 font-medium text-foreground">{plan.name}</td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-foreground">
                          INR {plan.monthlyFee.toLocaleString('en-IN')}/mo
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {referenceTab === 'matching' && (
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 font-mono text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <th className="px-3 py-2.5">Compatibility Factor</th>
                      <th className="px-3 py-2.5 text-right">Backend Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ROOMMATE_FACTORS.map((factor) => (
                      <tr key={factor.name} className="hover:bg-muted/40">
                        <td className="px-3 py-2.5 font-medium text-foreground">{factor.name}</td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold tabular-nums text-accent-text">
                          {factor.weight}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Priority Choices + Watermelon CardSplitAccordion Policies */}
        <div className="flex flex-col gap-4">
          <section
            aria-labelledby="priority-choices-heading"
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-baseline justify-between gap-2 pb-3">
              <div>
                <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Active Choices
                </span>
                <h2 id="priority-choices-heading" className="mt-0.5 text-base font-semibold text-foreground">
                  {isAuthenticated && isStudent
                    ? 'Your ranked room choices (max 3)'
                    : 'How priority submission works'}
                </h2>
              </div>
              <Link to="/apply" className="text-xs font-semibold text-accent-text hover:underline">
                {isAuthenticated ? 'Edit choices' : 'Sign in'}
              </Link>
            </div>

            {isAuthenticated && isStudent && latestApp?.choices?.length ? (
              <ol className="m-0 flex list-none flex-col divide-y divide-border border-t border-border p-0">
                {latestApp.choices.map((choice) => (
                  <li
                    key={choice.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-mono text-xs font-semibold text-foreground">
                        {choice.priority}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {choice.hostel_code} · Room {choice.room?.room_number || 'Auto'}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {choice.room
                            ? `${choice.room.capacity}-Seater · ${choice.room.is_ac ? 'AC' : 'Non-AC'}`
                            : choice.hostel_name}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="m-0 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                No submitted priority choices yet. Select up to 3 preferred blocks or rooms from the catalog or 2D floor plan.
              </p>
            )}
          </section>

          <section aria-labelledby="policy-accordion-heading">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h2 id="policy-accordion-heading" className="text-sm font-semibold text-foreground">
                Residence rules & system notes
              </h2>
              <span className="font-mono text-[11px] font-medium text-muted-foreground">
                Click row to inspect
              </span>
            </div>
            <CardSplitAccordion items={accordionItems} defaultOpenId="appliances" />
          </section>
        </div>
      </div>

      <EconomicsCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
};
