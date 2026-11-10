import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CandidateMatch } from '../../types/roommate';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RoommateHarmonyRadar } from './RoommateHarmonyRadar';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showRadar, setShowRadar] = useState(false);
  const score = candidate.score ? Math.round(candidate.score) : null;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full flex flex-col"
    >
      <Card hoverable className="flex flex-col h-full bg-surface">
        {/* Compatibility Text & Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Lifestyle Compatibility
            </span>
            <span className="font-sans font-bold text-sm text-primary tabular-nums">
              {score !== null ? `${score}% Match` : 'Evaluation Pending'}
            </span>
          </div>
          {/* Animated geometric horizontal progress bar */}
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score || 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        {/* Candidate Name & ID */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline">
            <h4 className="m-0 mb-1 text-lg font-serif font-semibold text-ink">
              {candidate.full_name}
            </h4>
            <span className="text-xs font-mono text-text-muted">
              #{candidate.student_id}
            </span>
          </div>
          <div className="text-xs text-text-muted">
            {candidate.branch} {candidate.cgpa !== null && `• CGPA: ${candidate.cgpa.toFixed(2)}`}
          </div>
        </div>

        {/* Badges / Factors */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="neutral" size="sm">{candidate.branch}</Badge>
          {candidate.is_room_aligned && (
            <Badge variant="success" size="sm">Room Choice Aligned</Badge>
          )}
          {candidate.cgpa !== null && candidate.cgpa >= 8.5 && (
            <Badge variant="info" size="sm">High Academic Merit</Badge>
          )}
        </div>

        {/* Interactive 7-Factor Lifestyle Radar Dropdown */}
        {score !== null && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowRadar(!showRadar)}
              className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-semibold text-primary bg-orange-50 border border-orange-200 rounded cursor-pointer transition-colors hover:bg-orange-100"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                7-Factor Lifestyle Harmony Radar
              </span>
              {showRadar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {showRadar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden mt-2"
                >
                  <RoommateHarmonyRadar score={score} compact />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action */}
        <div className="mt-auto pt-3 border-t border-border">
          {candidate.has_pending_request ? (
            <Button variant="secondary" size="sm" disabled className="w-full">
              Request Pending
            </Button>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSendRequest(candidate.student_id)}
                isLoading={isSending}
                className="w-full"
              >
                Connect / Request Roommate
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
