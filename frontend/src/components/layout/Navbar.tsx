import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EconomicsCalculatorModal } from '../economics/EconomicsCalculatorModal';
import { Calculator, Menu, X, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `no-underline text-sm font-medium px-3.5 py-2 rounded-lg transition-all duration-150 ${
      isActive
        ? 'text-white bg-white/15 border-b-2 border-brand font-semibold shadow-xs'
        : 'text-stone-300 hover:text-white hover:bg-white/10 border-b-2 border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center justify-between no-underline text-sm font-medium px-3.5 py-2.5 rounded-lg transition-colors ${
      isActive
        ? 'text-white bg-white/15 font-semibold border-l-3 border-brand'
        : 'text-stone-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A] text-white border-b-[3px] border-brand shadow-sm select-none">
      <div className="container flex items-center justify-between h-16">
        {/* Official LPU Typographic Mark */}
        <Link to="/" className="flex flex-col no-underline text-white group">
          <motion.div
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col"
          >
            <span className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase text-white leading-tight flex items-center gap-1.5">
              Lovely Professional University
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand group-hover:scale-150 transition-transform" />
            </span>
            <span className="font-serif text-[11px] sm:text-xs text-stone-300 italic leading-tight">
              Residential Accommodation Portal
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav Links with Distinct Gaps */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavLink to="/hostels" className={navLinkClass}>
            Explore Hostels
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Room Catalog
          </NavLink>

          <button
            type="button"
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-200 border border-orange-500/40 hover:bg-orange-500/30 transition-colors cursor-pointer ml-1"
          >
            <Calculator size={14} className="text-brand" />
            Fee Simulator
          </button>

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

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right flex flex-col gap-0.5">
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[130px] sm:max-w-none">
                  {user.student ? user.student.full_name : user.email.split('@')[0]}
                </span>
                <div className="flex gap-1.5 justify-end items-center">
                  <Badge variant={user.role === 'STUDENT' ? 'info' : 'warning'} size="sm">
                    {user.role}
                  </Badge>
                  {user.student && (
                    <span className="text-[10px] sm:text-[11px] text-stone-400 font-sans tabular-nums hidden sm:inline">
                      #{user.student.student_id}
                    </span>
                  )}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:block">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg border border-stone-600 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link to="/login" className="no-underline">
                <button className="px-3.5 py-1.5 rounded-lg border border-stone-500 hover:border-stone-400 bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link to="/register" className="no-underline">
                <button className="px-4 py-1.5 rounded-lg bg-brand hover:bg-[#D95314] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                  Claim Account
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden border-t border-white/10 bg-[#161616] px-4 py-3 overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col gap-1.5">
              <NavLink to="/hostels" className={mobileNavLinkClass}>
                <span>Explore Hostels (BH-1 to BH-8 &amp; GH-1 to GH-6)</span>
                <ChevronRight size={14} className="text-stone-500" />
              </NavLink>
              <NavLink to="/rooms" className={mobileNavLinkClass}>
                <span>Room Catalog &amp; Seater Specs</span>
                <ChevronRight size={14} className="text-stone-500" />
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCalcOpen(true);
                }}
                className="flex items-center justify-between text-left text-sm font-medium px-3.5 py-2.5 rounded-lg text-orange-300 hover:bg-white/10 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calculator size={15} className="text-brand" />
                  Fee &amp; Dining Tariff Simulator
                </span>
                <ChevronRight size={14} className="text-stone-500" />
              </button>

              {isAuthenticated ? (
                <>
                  <NavLink to="/roommates" className={mobileNavLinkClass}>
                    <span>7-Factor Roommate Matching</span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </NavLink>
                  <NavLink to="/apply" className={mobileNavLinkClass}>
                    <span>Apply for Room Reservation</span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </NavLink>
                  <NavLink to="/dashboard" className={mobileNavLinkClass}>
                    <span>Resident Dashboard &amp; Gate Pass</span>
                    <ChevronRight size={14} className="text-stone-500" />
                  </NavLink>
                  <div className="pt-3 mt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-stone-400">
                      Logged in as {user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md bg-stone-800 text-stone-200 text-xs font-semibold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-3 mt-2 border-t border-white/10 flex gap-2">
                  <Link to="/login" className="flex-1 no-underline">
                    <button className="w-full py-2 rounded-lg border border-stone-600 bg-stone-800 text-white text-xs font-semibold cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register" className="flex-1 no-underline">
                    <button className="w-full py-2 rounded-lg bg-brand text-white text-xs font-semibold cursor-pointer">
                      Claim Account
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Residential Economics & Tariff Simulator Modal */}
      <EconomicsCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </header>
  );
};
