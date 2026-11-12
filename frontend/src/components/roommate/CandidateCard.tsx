import React from 'react';
import type { CandidateMatch } from '../../types/roommate';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface CandidateCardProps {
  candidate: CandidateMatch;
  onSendRequest: (studentId: string) => void;
  isSending?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSendRequest,
  isSending = false,
}) => {
  const score = candidate.score !== null && candidate.score !== undefined
    ? Math.round(candidate.score)
    : null;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong">
      <div className="mb-3">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Overall Compatibility
          </span>
          <span className="font-mono text-sm font-bold text-accent-text tabular-nums">
            {score !== null ? `${score}% Match` : 'Evaluation Pending'}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent-brand transition-[width] duration-300"
            style={{ width: `${score ?? 0}%` }}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="m-0 text-base font-semibold text-foreground">
            {candidate.full_name}
          </h4>
          {candidate.is_room_aligned && (
            <Badge variant="success" size="sm">
              Same Room Target
            </Badge>
          )}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          ID: <strong className="font-mono text-foreground tabular-nums">{candidate.student_id}</strong>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground">
        <span className="truncate">{candidate.branch || 'Undergraduate'}</span>
        {candidate.cgpa !== null && candidate.cgpa !== undefined && (
          <span className="shrink-0 font-mono">
            CGPA: <strong className="tabular-nums">{candidate.cgpa.toFixed(2)}</strong>
          </span>
        )}
      </div>

      {candidate.target_room && (
        <div className="mb-3 text-xs text-muted-foreground">
          Preferred Room: <strong className="font-mono text-foreground">{candidate.target_room}</strong>
        </div>
      )}

      <div className="mt-auto border-t border-border pt-3">
        {candidate.has_pending_request ? (
          <Button variant="secondary" size="sm" disabled style={{ width: '100%' }}>
            Request Pending
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSendRequest(candidate.student_id)}
            isLoading={isSending}
            style={{ width: '100%' }}
          >
            Connect / Request Roommate
          </Button>
        )}
      </div>
    </article>
  );
};
