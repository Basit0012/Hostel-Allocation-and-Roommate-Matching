import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hostelsApi } from '../api/hostelsApi';
import { HostelSummary } from '../types/hostel';
import { HostelCard } from '../components/hostel/HostelCard';
import { Spinner } from '../components/common/Spinner';
import { Search, Building, Sparkles } from 'lucide-react';

export const HostelsPage: React.FC = () => {
  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    hostelsApi
      .getHostels(genderFilter !== 'ALL' ? { gender: genderFilter } : undefined)
      .then((data) => {
        setHostels(data.hostels);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load hostels.'))
      .finally(() => setIsLoading(false));
  }, [genderFilter]);

  const filteredHostels = hostels.filter((h) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return h.name.toLowerCase().includes(term) || h.code.toLowerCase().includes(term);
  });

  const filterTabs = [
    { key: 'ALL', label: 'All 14 Residential Complexes' },
    { key: 'MALE', label: 'Boys Towers (BH-1 to BH-8)' },
    { key: 'FEMALE', label: 'Girls Towers (GH-1 to GH-6)' },
  ];

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        stiffness: 280,
        damping: 24,
      },
    },
  };

  return (
    <div className="container py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          <Building size={14} />
          Official Campus Housing Registry
        </div>
        <h1 className="text-3xl font-serif font-semibold text-ink tracking-tight m-0 mb-2">
          Campus Hostels Directory
        </h1>
        <p className="text-sm text-text-muted m-0 max-w-2xl">
          Authoritative residential tower registry, 2D vector CAD floor plans, and live vacancy status across all 14 LPU complexes.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 p-3.5 bg-surface rounded-xl border border-border shadow-xs"
      >
        {/* Gender Filter Buttons with Motion Spring Pill */}
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((btn) => {
            const isActive = genderFilter === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setGenderFilter(btn.key as 'ALL' | 'MALE' | 'FEMALE')}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isActive ? 'text-white' : 'text-text hover:text-ink hover:bg-black/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHostelFilter"
                    className="absolute inset-0 bg-primary rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search block or code (e.g. BH-1)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-ink text-xs placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <Spinner label="Loading campus hostel directory..." />
      ) : error ? (
        <div className="p-8 text-center text-red-600 bg-surface border border-border rounded-xl">
          {error}
        </div>
      ) : filteredHostels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center bg-surface rounded-xl border border-border"
        >
          <h3 className="font-serif text-lg font-semibold text-ink m-0 mb-1">
            No Residential Complexes Found
          </h3>
          <p className="text-xs text-text-muted m-0">
            No hostel records match your current gender filter or search keyword.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHostels.map((hostel) => (
            <motion.div key={hostel.id} variants={itemVariants}>
              <HostelCard hostel={hostel} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
