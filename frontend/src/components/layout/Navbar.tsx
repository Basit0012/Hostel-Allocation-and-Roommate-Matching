import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EconomicsCalculatorModal } from '../economics/EconomicsCalculatorModal';
import { Calculator, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `no-underline text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/10 border-b-2 border-brand font-semibold shadow-xs'
        : 'text-[#DDD8CF] hover:text-white hover:bg-white/5 border-b-2 border-transparent'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ink text-white border-b-[3px] border-brand shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Official LPU Typographic Mark with subtle motion */}
        <Link to="/" className="flex flex-col no-underline text-white group">
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col"
          >
            <span className="font-sans font-bold text-sm tracking-widest uppercase text-white leading-tight flex items-center gap-2">
              Lovely Professional University
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand group-hover:scale-150 transition-transform" />
            </span>
            <span className="font-serif text-xs text-[#DDD8CF] italic leading-tight">
              Residential Accommodation Portal
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/hostels" className={navLinkClass}>
            Explore Hostels
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Room Catalog
          </NavLink>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-orange-500/15 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25 transition-colors cursor-pointer ml-1"
          >
            <Calculator size={14} className="text-brand" />
            Fee Simulator
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand"></span>
            </span>
          </motion.button>

          {isAuthenticated && (
            <>
              <NavLink to="/roommates" className={navLinkClass}>
                Roommates
              </NavLink>
              <NavLink to="/apply" className={navLinkClass}>
                Apply
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            </>
          )}
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="text-right flex flex-col gap-0.5">
                <span className="text-xs md:text-sm font-semibold text-white">
                  {user.student ? user.student.full_name : user.email.split('@')[0]}
                </span>
                <div className="flex gap-1.5 justify-end items-center">
                  <Badge variant={user.role === 'STUDENT' ? 'info' : 'warning'} size="sm">
                    {user.role}
                  </Badge>
                  {user.student && (
                    <span className="text-[11px] text-[#DDD8CF] font-sans tabular-nums">
                      #{user.student.student_id}
                    </span>
                  )}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-[#5C5750] h-8 text-xs"
                >
                  Sign Out
                </Button>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="no-underline">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-[#5C5750] h-8 text-xs"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register" className="no-underline">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="primary" size="sm" className="h-8 text-xs">
                    Claim Account
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Residential Economics & Tariff Simulator Modal */}
      <EconomicsCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </header>
  );
};
