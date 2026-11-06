import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HostelSummary } from '../../types/hostel';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Compass, Sparkles } from 'lucide-react';

interface HostelCardProps {
  hostel: HostelSummary;
}

export const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full flex flex-col"
    >
      <Card hoverable className="flex flex-col h-full bg-surface">
        {/* Top Badges */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="neutral">
            {hostel.gender_policy_display}
          </Badge>
          <div className="flex items-center gap-1.5">
            {hostel.vacant_beds > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            <Badge variant={hostel.status === 'ACTIVE' ? 'success' : 'danger'}>
              {hostel.status_display}
            </Badge>
          </div>
        </div>

        {/* Building Header */}
        <div className="mb-3">
          <h3 className="m-0 mb-1 text-xl font-serif font-semibold text-ink">
            {hostel.name}
          </h3>
          <div className="text-xs text-text-muted">
            Tower: <strong className="text-ink">{hostel.code}</strong> • Lovely Professional University
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text leading-relaxed flex-1 mb-4">
          {hostel.description || 'Full residential amenities, quiet study rooms, 24/7 security, turnstile gate pass readers, and high-speed campus Wi-Fi.'}
        </p>

        {/* Building Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#FAF8F3] border border-border rounded-lg mb-4 text-center">
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
              Capacity
            </div>
            <div className="font-semibold text-sm text-ink tabular-nums">
              {hostel.total_beds} Beds
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
              Vacant
            </div>
            <div
              className={`font-semibold text-sm tabular-nums ${
                hostel.vacant_beds > 0 ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {hostel.vacant_beds} Free
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
              Occupancy
            </div>
            <div className="font-semibold text-sm text-ink tabular-nums">
              {hostel.occupancy_pct}%
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
          <div>
            <div className="text-[10px] text-text-muted uppercase">10-Mo Session Fee</div>
            <div className="font-serif font-semibold text-base text-ink tabular-nums">
              {hostel.min_standard_fee ? `₹${Number(hostel.min_standard_fee).toLocaleString('en-IN')}` : 'Variable'}
            </div>
          </div>
          <Link to={`/hostels/${hostel.id}`} className="no-underline">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
                <Compass size={14} className="text-brand" />
                2D Floor Plan &rarr;
              </Button>
            </motion.div>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};
