import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="m3-footer-safe mt-10 border-t border-border bg-card">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <div className="text-sm font-semibold text-foreground">
            Lovely Professional University. Residential Allocation Portal
          </div>
          <div className="text-xs text-muted-foreground">
            Seeded campus fixture dataset for allocation and roommate matching workflows
          </div>
        </div>

        <nav aria-label="Footer quick links" className="flex flex-wrap items-center gap-4">
          {[
            { label: 'Student Home', to: '/' },
            { label: 'Hostels', to: '/hostels' },
            { label: 'Rooms', to: '/rooms' },
            { label: 'Roommates', to: '/roommates' },
            { label: 'Apply', to: '/apply' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
