import React from 'react';
import { AppShell } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppShell>
      <main
        className="m3-main-with-rail"
        style={{ flex: 1 }}
      >
        {children}
      </main>
      <Footer />
    </AppShell>
  );
};
