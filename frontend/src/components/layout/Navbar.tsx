import React, { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  BedDouble,
  Calculator,
  FileCheck2,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '@/lib/utils';
import { CommandSearch, type CommandItem } from '../watermelon/CommandSearch';
import { EconomicsCalculatorModal } from '../economics/EconomicsCalculatorModal';

interface NavDestination {
  to: string;
  label: string;
  shortLabel: string;
  group: 'Workspace' | 'Residence';
  icon: React.ReactNode;
  authOnly?: boolean;
  studentOnly?: boolean;
}

const DESTINATIONS: NavDestination[] = [
  { to: '/', label: 'Student Home', shortLabel: 'Home', group: 'Workspace', icon: <Home size={16} /> },
  { to: '/dashboard', label: 'Dashboard', shortLabel: 'Dashboard', group: 'Workspace', icon: <LayoutDashboard size={16} />, authOnly: true },
  { to: '/hostels', label: 'Hostel Explorer', shortLabel: 'Hostels', group: 'Residence', icon: <Building2 size={16} /> },
  { to: '/rooms', label: 'Rooms & Tariffs', shortLabel: 'Rooms', group: 'Residence', icon: <BedDouble size={16} /> },
  { to: '/roommates', label: 'Roommate Match', shortLabel: 'Mates', group: 'Residence', icon: <Users size={16} />, authOnly: true, studentOnly: true },
  { to: '/apply', label: 'Priority Application', shortLabel: 'Apply', group: 'Residence', icon: <FileCheck2 size={16} />, authOnly: true, studentOnly: true },
];

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Student Home',
  '/dashboard': 'Dashboard',
  '/hostels': 'Hostel Explorer',
  '/rooms': 'Room Catalog',
  '/roommates': 'Roommate Match',
  '/apply': 'Priority Application',
  '/login': 'Sign In',
  '/register': 'Create Account',
};

export const BrandMark: React.FC = () => (
  <span className="inline-flex items-center gap-2 min-w-0">
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-primary text-primary-foreground"
    >
      <span className="h-2.5 w-2.5 rounded-sm bg-accent-brand" />
    </span>
    <span className="min-w-0 leading-tight">
      <span className="block truncate text-sm font-bold tracking-tight text-foreground">
        LPU Residence
      </span>
      <span className="hidden sm:block truncate font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        Portal Workspace
      </span>
    </span>
  </span>
);

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [railExpanded, setRailExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const isStudent = user?.role === 'STUDENT';

  const visibleDestinations = useMemo(
    () =>
      DESTINATIONS.filter(
        (d) => (!d.authOnly || isAuthenticated) && (!d.studentOnly || isStudent),
      ),
    [isAuthenticated, isStudent],
  );

  const workspaceItems = useMemo(
    () => visibleDestinations.filter((d) => d.group === 'Workspace'),
    [visibleDestinations],
  );

  const residenceItems = useMemo(
    () => visibleDestinations.filter((d) => d.group === 'Residence'),
    [visibleDestinations],
  );

  const mobileBarItems = useMemo(() => {
    const core = isAuthenticated
      ? isStudent
        ? ['/', '/hostels', '/apply', '/dashboard']
        : ['/', '/hostels', '/rooms', '/dashboard']
      : ['/', '/hostels', '/rooms', '/login'];
    return core
      .map((path) => {
        const match = DESTINATIONS.find((d) => d.to === path);
        if (match) return match;
        return {
          to: '/login',
          label: 'Sign In',
          shortLabel: 'Sign In',
          group: 'Workspace' as const,
          icon: <LogIn size={16} />,
        };
      })
      .slice(0, 4);
  }, [isAuthenticated]);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/hostels/')) return 'Hostel Floor Plan';
    return ROUTE_TITLES[location.pathname] || 'Residence Portal';
  }, [location.pathname]);

  const commandItems = useMemo<CommandItem[]>(() => {
    const navCommands: CommandItem[] = [
      {
        id: 'nav-home',
        title: 'Student Home',
        subtitle: '7-stage timeline, capacity notices, and fee reference',
        section: 'Navigation',
        icon: <Home size={15} />,
        action: () => navigate('/'),
      },
      {
        id: 'nav-hostels',
        title: 'Hostel Explorer',
        subtitle: 'Inspect campus blocks and CAD floor plans',
        section: 'Navigation',
        icon: <Building2 size={15} />,
        action: () => navigate('/hostels'),
      },
      {
        id: 'nav-rooms',
        title: 'Rooms & Tariffs',
        subtitle: 'Filter rooms by AC/Cooler, occupancy, and seats',
        section: 'Navigation',
        icon: <BedDouble size={15} />,
        action: () => navigate('/rooms'),
      },
      ...(isAuthenticated
        ? [
            {
              id: 'nav-dashboard',
              title: 'Dashboard',
              subtitle: isStudent
                ? 'Application state, gate pass, and RMS requests'
                : 'Campus census, gate pass approvals, and RMS dispatch',
              section: 'Navigation',
              icon: <LayoutDashboard size={15} />,
              action: () => navigate('/dashboard'),
            },
            ...(isStudent
              ? [
                  {
                    id: 'nav-roommates',
                    title: 'Roommate Match',
                    subtitle: '7-factor preferences and mutual buddy group',
                    section: 'Navigation',
                    icon: <Users size={15} />,
                    action: () => navigate('/roommates'),
                  },
                  {
                    id: 'nav-apply',
                    title: 'Priority Application (Max 3)',
                    subtitle: 'Submit up to 3 ordered block and room preferences',
                    section: 'Navigation',
                    icon: <FileCheck2 size={15} />,
                    action: () => navigate('/apply'),
                  },
                ]
              : []),
          ]
        : [
            {
              id: 'nav-login',
              title: 'Sign In',
              subtitle: 'Access your student, warden, or admin workspace',
              section: 'Navigation',
              icon: <LogIn size={15} />,
              action: () => navigate('/login'),
            },
          ]),
    ];

    const toolCommands: CommandItem[] = [
      {
        id: 'tool-calc',
        title: 'Fee Breakdown Simulator',
        subtitle: 'Estimate sample reference fees and living budget',
        section: 'Tools & Display',
        icon: <Calculator size={15} />,
        action: () => setCalcOpen(true),
      },
      {
        id: 'tool-theme',
        title: `Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle surface appearance across all routes',
        section: 'Tools & Display',
        icon: resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
        action: toggleTheme,
      },
    ];

    return [...navCommands, ...toolCommands];
  }, [isAuthenticated, isStudent, navigate, resolvedTheme, toggleTheme]);

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const renderRailLink = (item: NavDestination) => {
    const isActive =
      item.to === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.to);

    return (
      <NavLink
        key={item.to}
        to={item.to}
        title={!railExpanded ? item.label : undefined}
        aria-label={item.label}
        onClick={() => setDrawerOpen(false)}
        className={cn(
          'flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors whitespace-nowrap',
          railExpanded ? 'justify-start' : 'justify-center px-0',
          isActive
            ? 'border-border bg-background text-foreground font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
            : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <span
          className={cn(
            'shrink-0',
            isActive ? 'text-accent-text' : 'text-muted-foreground',
          )}
        >
          {item.icon}
        </span>
        {railExpanded && <span className="truncate">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Top Sticky Workspace Header */}
      <header className="sticky top-0 z-30 h-14 w-full border-b border-border bg-background/95 backdrop-blur-xs">
        <div className="flex h-full w-full items-center justify-between gap-2 px-3 sm:px-5">
          {/* Left: Sidebar Toggle / Mobile Drawer Trigger + Brand + Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setRailExpanded((v) => !v)}
              aria-label={railExpanded ? 'Collapse navigation sidebar' : 'Expand navigation sidebar'}
              className="m3-desktop-rail inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {railExpanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="m3-mobile-menu-trigger inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted"
            >
              <Menu size={18} />
            </button>

            <Link to="/" className="min-w-0 shrink">
              <BrandMark />
            </Link>

            <span className="hidden md:inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span aria-hidden="true">/</span>
              <span className="font-mono font-medium text-foreground">{pageTitle}</span>
            </span>
          </div>

          {/* Center: Watermelon Command-K Quick Search (hidden below sm to protect 360px layout) */}
          <div className="hidden sm:flex flex-1 items-center justify-center px-2">
            <CommandSearch items={commandItems} placeholder="Search pages or actions..." />
          </div>

          {/* Right: Calculator + Theme Toggle + Account */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCalcOpen(true)}
              title="Fee Breakdown Simulator"
              aria-label="Open fee breakdown simulator"
              className="hidden sm:inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Calculator size={15} className="text-muted-foreground" />
              <span className="hidden lg:inline">Fee Sim</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted"
            >
              {resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-accent-brand" aria-hidden="true" />
                  <span className="max-w-[110px] truncate">
                    {user?.student?.full_name || user?.student_id_login || user?.email || 'Account'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Collapsible Sidebar + Content Split */}
      <div className="flex flex-1 min-w-0">
        <aside
          aria-label="Workspace navigation"
          className={cn(
            'm3-desktop-rail shrink-0 flex-col justify-between border-r border-border bg-card transition-[width] duration-200',
            railExpanded ? 'w-[236px] p-3' : 'w-[64px] p-2',
          )}
        >
          <div className="flex flex-col gap-5">
            <div>
              {railExpanded && (
                <div className="px-2.5 pb-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Workspace
                </div>
              )}
              <nav className="flex flex-col gap-1">
                {workspaceItems.map(renderRailLink)}
              </nav>
            </div>

            <div>
              {railExpanded && (
                <div className="px-2.5 pb-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Residence
                </div>
              )}
              <nav className="flex flex-col gap-1">
                {residenceItems.map(renderRailLink)}
              </nav>
            </div>
          </div>

          {railExpanded ? (
            <div className="mt-6 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-brand" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold text-foreground uppercase">
                  Priority Engine
                </span>
              </div>
              <p className="mt-1 mb-0 text-xs leading-relaxed text-muted-foreground">
                Up to 3 room choices reviewed per intake cycle. No real-time seat lock in v1.
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <span
                title="Priority Engine: Up to 3 choices"
                className="h-2.5 w-2.5 rounded-full bg-accent-brand"
              />
            </div>
          )}
        </aside>

        {/* Workspace Canvas */}
        <div className="flex min-w-0 flex-1 flex-col bg-background">
          {children}
        </div>
      </div>

      {/* Mobile Slide-over Drawer (at 360px - 839px) */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portal navigation drawer"
          className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-[1px]"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="flex h-full w-[280px] max-w-[85vw] flex-col justify-between border-r border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <BrandMark />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="sm:hidden">
                <CommandSearch items={commandItems} placeholder="Quick search..." />
              </div>

              <div>
                <div className="px-2 pb-1.5 font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Navigation
                </div>
                <nav className="flex flex-col gap-1">
                  {visibleDestinations.map((item) => {
                    const isActive =
                      item.to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium',
                          isActive
                            ? 'border-border bg-background text-foreground font-semibold'
                            : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setCalcOpen(true);
                }}
                className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground"
              >
                <Calculator size={15} />
                Fee Simulator
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background text-sm font-semibold text-foreground"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (< 840px); suppressed on auth forms so submit buttons stay unobstructed */}
      {!['/login', '/register'].includes(location.pathname) && (
        <nav
          aria-label="Mobile quick navigation"
          className="m3-mobile-bottom-bar fixed right-0 bottom-0 left-0 z-30 h-15 border-t border-border bg-background/95 px-2 backdrop-blur-xs"
        >
          <div className="flex w-full items-center justify-around">
            {mobileBarItems.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors',
                    isActive ? 'text-foreground font-semibold' : 'text-muted-foreground',
                  )}
                >
                  <span className={cn(isActive && 'text-accent-text')}>{item.icon}</span>
                  <span>{item.shortLabel}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}

      <EconomicsCalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  );
};
