'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.role === 'admin') {
          setIsAuthorized(true);
        } else {
          // Normal customer/client role -> not permitted into admin
          setIsAuthorized(false);
        }
      } else {
        // No session: deny access
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  }, []);

  // Access Denied Screen for regular Customers/Clients
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary mb-2 block font-semibold">
          Admin Access Only
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium mb-2 tracking-tight">
          Administrator Access Required
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
          The Administration Console is reserved for platform administrators. As an event organizer, you can manage your events, photobooth templates, and QR codes in your Organizer Studio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-xs font-mono uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Organizer Studio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex selection:bg-primary/20 selection:text-primary">
      {/* Desktop Admin Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full shadow-2xl">
            <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
