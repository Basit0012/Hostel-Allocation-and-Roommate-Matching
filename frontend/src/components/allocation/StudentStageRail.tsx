import React from 'react';
import {
  Check,
  Circle,
  Clock,
  CreditCard,
  FileCheck2,
  Home,
  Minus,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';
import type { User } from '../../types/auth';
import type { DashboardSummary, HostelApplicationItem } from '../../types/application';
import type { RoommateGroupData } from '../../types/roommate';
import { StepIndicator, type IndicatorStep } from '../watermelon/StepIndicator';
import { cn } from '@/lib/utils';

export type StageVisualState = 'done' | 'active' | 'danger' | 'upcoming' | 'untracked';

export interface LifecycleStage {
  index: string;
  label: string;
  state: StageVisualState;
  detail: string;
}

interface StudentStageRailProps {
  isAuthenticated: boolean;
  user: User | null;
  summary: DashboardSummary | null;
  latestApp: HostelApplicationItem | null;
  roommateGroup: RoommateGroupData | null;
}

export function buildLifecycleStages({
  isAuthenticated,
  user,
  latestApp,
  roommateGroup,
}: Omit<StudentStageRailProps, 'summary'>): LifecycleStage[] {
  const isStudent = isAuthenticated && user?.role === 'STUDENT' && Boolean(user.student);
  const student = user?.student;
  const activeAlloc = student?.active_allocation;

  let eligibleStage: LifecycleStage;
  if (!isAuthenticated) {
    eligibleStage = {
      index: '01',
      label: 'Eligible',
      state: 'upcoming',
      detail: 'Sign in to verify record',
    };
  } else if (!isStudent) {
    eligibleStage = {
      index: '01',
      label: 'Eligible',
      state: 'upcoming',
      detail: `${user?.role || 'Staff'} account`,
    };
  } else if (student?.enrollment_status === 'ACTIVE') {
    eligibleStage = {
      index: '01',
      label: 'Eligible',
      state: 'done',
      detail: 'Active registry record',
    };
  } else {
    eligibleStage = {
      index: '01',
      label: 'Eligible',
      state: 'danger',
      detail: student?.enrollment_status || 'Check enrollment',
    };
  }

  const choiceCount = latestApp?.choices?.length ?? 0;
  let choicesStage: LifecycleStage;
  if (!isStudent) {
    choicesStage = {
      index: '02',
      label: 'Choices (max 3)',
      state: 'upcoming',
      detail: 'Up to 3 ordered rooms',
    };
  } else if (choiceCount > 0) {
    choicesStage = {
      index: '02',
      label: 'Choices (max 3)',
      state: 'done',
      detail: `${choiceCount} of 3 submitted`,
    };
  } else {
    choicesStage = {
      index: '02',
      label: 'Choices (max 3)',
      state: 'active',
      detail: '0 of 3 submitted',
    };
  }

  let reviewStage: LifecycleStage;
  if (!isStudent || !latestApp) {
    reviewStage = {
      index: '03',
      label: 'Under Review',
      state: 'upcoming',
      detail: 'Awaiting choices',
    };
  } else if (latestApp.status === 'APPROVED' || latestApp.status === 'ALLOCATED') {
    reviewStage = {
      index: '03',
      label: 'Under Review',
      state: 'done',
      detail: latestApp.status_display,
    };
  } else if (latestApp.status === 'REJECTED') {
    reviewStage = {
      index: '03',
      label: 'Under Review',
      state: 'danger',
      detail: 'Rejected',
    };
  } else {
    reviewStage = {
      index: '03',
      label: 'Under Review',
      state: 'active',
      detail: latestApp.status_display,
    };
  }

  let allocatedStage: LifecycleStage;
  if (!isStudent) {
    allocatedStage = {
      index: '04',
      label: 'Allocated',
      state: 'upcoming',
      detail: 'Pending allocation',
    };
  } else if (activeAlloc) {
    allocatedStage = {
      index: '04',
      label: 'Allocated',
      state: 'done',
      detail: `${activeAlloc.hostel_code} ${activeAlloc.room_number} Bed ${activeAlloc.bed_identifier}`,
    };
  } else {
    allocatedStage = {
      index: '04',
      label: 'Allocated',
      state: 'upcoming',
      detail: 'Not assigned yet',
    };
  }

  let roommateStage: LifecycleStage;
  if (!isStudent) {
    roommateStage = {
      index: '05',
      label: 'Roommate',
      state: 'upcoming',
      detail: 'Optional 7-factor group',
    };
  } else if (roommateGroup?.is_confirmed) {
    roommateStage = {
      index: '05',
      label: 'Roommate',
      state: 'done',
      detail: `Confirmed ${roommateGroup.member_count}/${roommateGroup.capacity}`,
    };
  } else if (roommateGroup) {
    roommateStage = {
      index: '05',
      label: 'Roommate',
      state: 'active',
      detail: `Group ${roommateGroup.member_count}/${roommateGroup.capacity} open`,
    };
  } else if (student?.has_roommate_preferences) {
    roommateStage = {
      index: '05',
      label: 'Roommate',
      state: 'active',
      detail: '7 factors saved',
    };
  } else {
    roommateStage = {
      index: '05',
      label: 'Roommate',
      state: 'upcoming',
      detail: 'Preferences not set',
    };
  }

  // Stage 6 & 7 have no backend payment or check-in endpoints yet.
  const feeStage: LifecycleStage = {
    index: '06',
    label: 'Fee',
    state: 'untracked',
    detail: 'Not tracked yet',
  };

  const confirmedStage: LifecycleStage = {
    index: '07',
    label: 'Confirmed',
    state: 'untracked',
    detail: 'Not tracked yet',
  };

  return [
    eligibleStage,
    choicesStage,
    reviewStage,
    allocatedStage,
    roommateStage,
    feeStage,
    confirmedStage,
  ];
}

const STAGE_ICONS = [
  ShieldCheck,
  FileCheck2,
  Clock,
  Home,
  Users,
  CreditCard,
  Check,
];

function getStageCardStyle(state: StageVisualState): {
  cardClass: string;
  detailClass: string;
  icon: React.ReactNode;
} {
  switch (state) {
    case 'done':
      return {
        cardClass: 'border-[var(--available-border)] bg-[var(--available-bg)]/50',
        detailClass: 'text-[var(--available-ink)]',
        icon: <Check size={14} strokeWidth={2.2} className="text-[var(--available-ink)]" aria-hidden="true" />,
      };
    case 'active':
      return {
        cardClass: 'border-2 border-accent-brand bg-background',
        detailClass: 'text-accent-text',
        icon: <Clock size={14} strokeWidth={2} className="text-accent-text" aria-hidden="true" />,
      };
    case 'danger':
      return {
        cardClass: 'border-[var(--danger-border)] bg-[var(--danger-bg)]/50',
        detailClass: 'text-[var(--danger-ink)]',
        icon: <XCircle size={14} strokeWidth={2} className="text-[var(--danger-ink)]" aria-hidden="true" />,
      };
    case 'untracked':
      return {
        cardClass: 'border-dashed border-border-strong bg-muted/40',
        detailClass: 'text-muted-foreground',
        icon: <Minus size={14} strokeWidth={2} className="text-muted-foreground" aria-hidden="true" />,
      };
    case 'upcoming':
    default:
      return {
        cardClass: 'border-border bg-background',
        detailClass: 'text-muted-foreground',
        icon: <Circle size={12} strokeWidth={2} className="text-muted-foreground" aria-hidden="true" />,
      };
  }
}

export const StudentStageRail: React.FC<StudentStageRailProps> = ({
  isAuthenticated,
  user,
  summary,
  latestApp,
  roommateGroup,
}) => {
  const stages = buildLifecycleStages({ isAuthenticated, user, latestApp, roommateGroup });
  const activeCycle = summary?.campus?.active_cycle_name || 'Current Intake Cycle';

  const indicatorSteps: IndicatorStep[] = stages.map((stage, idx) => ({
    id: stage.index,
    label: stage.label,
    statusText: stage.detail,
    state: stage.state,
    icon: STAGE_ICONS[idx] || Circle,
  }));

  return (
    <section
      aria-labelledby="stage-rail-heading"
      className="py-1"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
        <div>
          <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Allocation Sequence
          </span>
          <h2 id="stage-rail-heading" className="mt-1 text-base font-semibold text-foreground">
            7-stage student residence progress
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-accent-brand" aria-hidden="true" />
          {activeCycle}
        </span>
      </div>

      {/* Watermelon interactive clip-path step bar */}
      <StepIndicator steps={indicatorSteps} />

      <ol className="student-stage-list mt-3">
        {stages.map((stage) => {
          const style = getStageCardStyle(stage.state);
          return (
            <li
              key={stage.index}
              className={cn(
                'flex flex-col justify-between gap-2 rounded-lg border px-3 py-2.5 min-w-0',
                style.cardClass,
              )}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
                  {stage.index}
                </span>
                {style.icon}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-foreground">
                  {stage.label}
                </div>
                <div className={cn('mt-0.5 text-xs font-medium leading-snug', style.detailClass)}>
                  {stage.detail}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
