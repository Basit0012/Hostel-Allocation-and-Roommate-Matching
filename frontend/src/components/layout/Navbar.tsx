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
    `no-underline text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 ${
      isActive
        ? 'text-white bg-white/10 border-b-2 border-brand font-semibold shadow-xs'
        : 'text-[#DDD8CF] hover:text-white hover:bg-white/5 border-b-2 border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `flex items-center justify-between no-underline text-sm font-medium px-3 py-2.5 rounded-md transition-colors ${
      isActive
        ? 'text-white bg-white/10 font-semibold border-l-3 border-brand'
        : 'text-[#DDD8CF] hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ink text-white border-b-[3px] border-brand shadow-sm">
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
            <span className="font-serif text-[11px] sm:text-xs text-[#DDD8CF] italic leading-tight">
              Residential Accommodation Portal
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
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

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right flex flex-col gap-0.5">
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                  {user.student ? user.student.full_name : user.email.split('@')[0]}
                </span>
                <div className="flex gap-1.5 justify-end items-center">
                  <Badge variant={user.role === 'STUDENT' ? 'info' : 'warning'} size="sm">
                    {user.role}
                  </Badge>
                  {user.student && (
                    <span className="text-[10px] sm:text-[11px] text-[#DDD8CF] font-sans tabular-nums hidden sm:inline">
                      #{user.student.student_id}
                    </span>
                  )}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:block">
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
            <div className="hidden sm:flex items-center gap-2">
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-white/10 bg-[#161616] px-4 py-3 overflow-hidden shadow-lg"
          >
            <nav className="flex flex-col gap-1">
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
                className="flex items-center justify-between text-left text-sm font-medium px-3 py-2.5 rounded-md text-orange-300 hover:bg-white/5 cursor-pointer"
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-white border-[#5C5750] h-7 text-xs"
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-3 mt-2 border-t border-white/10 flex gap-2">
                  <Link to="/login" className="flex-1 no-underline">
                    <Button variant="outline" size="sm" className="w-full text-white border-[#5C5750] h-8 text-xs">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1 no-underline">
                    <Button variant="primary" size="sm" className="w-full h-8 text-xs">
                      Claim Account
                    </Button>
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
