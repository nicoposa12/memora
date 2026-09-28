'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 xl:w-72 z-40 shadow-xs">
        <DashboardSidebar />
      </div>

      {/* Mobile Slide-Over Drawer with Backdrop Blur */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-300 shadow-2xl bg-card">
            {/* Close Button Floating */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-3 z-50 p-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            <DashboardSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 xl:pl-72 flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
