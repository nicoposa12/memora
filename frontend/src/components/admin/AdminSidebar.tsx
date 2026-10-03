'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  Users, 
  UserCog,
  Camera, 
  ShieldAlert, 
  DollarSign, 
  Sliders, 
  Server, 
  ArrowLeftRight, 
  LogOut,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState('Chief Administrator');
  const [adminEmail, setAdminEmail] = useState('');
  const [custCount, setCustCount] = useState(0);
  const [activeBoothsCount, setActiveBoothsCount] = useState(0);
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [mrrAmount, setMrrAmount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setAdminName(parsed.name);
        if (parsed.email) setAdminEmail(parsed.email);
      }
    } catch {}

    // Load accurate records
    try {
      const { getRealCustomers, getRealBooths, getRealFlaggedPhotos, isAdminRecord } = require('@/lib/adminRecords');
      const customers = getRealCustomers();
      const booths = getRealBooths();
      const flagged = getRealFlaggedPhotos();
      
      const organizerCustomers = customers.filter((c: any) => !isAdminRecord(c));
      setCustCount(organizerCustomers.length);
      setActiveBoothsCount(booths.filter((b: any) => b.status === 'active').length);
      setFlaggedCount(flagged.filter((f: any) => f.status === 'pending').length);
      const proCount = organizerCustomers.filter((c: any) => c.tier === 'Studio Pro' || c.tier === 'STUDIO').length;
      setMrrAmount(proCount * 4999);
    } catch {}
  }, []);

  const adminNav = [
    {
      group: 'Platform',
      items: [
        {
          label: 'Overview',
          href: '/admin',
          icon: LayoutDashboard,
        },
        {
          label: 'Manage Users',
          href: '/admin/users',
          icon: UserCog,
          badge: custCount > 0 ? custCount.toString() : undefined,
          badgeColor: 'coral' as const,
        },
        {
          label: 'Organizers',
          href: '/admin/hosts',
          icon: Users,
        },
        {
          label: 'Photobooths',
          href: '/admin/booths',
          icon: Camera,
          badge: activeBoothsCount > 0 ? `${activeBoothsCount} Live` : undefined,
          badgeColor: 'emerald' as const,
        },
        {
          label: 'Moderation',
          href: '/admin/moderation',
          icon: ShieldAlert,
          badge: flaggedCount > 0 ? flaggedCount.toString() : undefined,
          badgeColor: 'coral' as const,
        },
      ],
    },
    {
      group: 'Administration',
      items: [
        {
          label: 'Revenue',
          href: '/admin/revenue',
          icon: DollarSign,
          badge: mrrAmount > 0 ? `₱${mrrAmount.toLocaleString()}` : undefined,
          badgeColor: 'coral' as const,
        },
        {
          label: 'Plans & Features',
          href: '/admin/plans',
          icon: CreditCard,
          badge: 'Matrix',
          badgeColor: 'coral' as const,
        },
        {
          label: 'Templates & Frames',
          href: '/admin/templates',
          icon: Sliders,
          badge: 'Studio',
          badgeColor: 'coral' as const,
        },
        {
          label: 'System & Logs',
          href: '/admin/system',
          icon: Server,
        },
      ],
    },
  ];

  const handleSwitchToHostPortal = () => {
    router.push('/dashboard');
  };

  return (
    <aside className="w-64 lg:w-72 bg-card border-r border-border flex flex-col justify-between h-screen sticky top-0 z-40 selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" title="Return to homepage">
            <Logo className="w-6 h-6 text-primary transition-transform group-hover:scale-105" />
            <span className="font-display text-2xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
              Memora
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-none">
        {adminNav.map((sec) => (
          <div key={sec.group} className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground/75 px-3 font-semibold block mb-1">
              {sec.group}
            </span>
            {sec.items.map((item) => {
              const isActive = pathname === item.href;
              const IconComp = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                      item.badgeColor === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium'
                        : item.badgeColor === 'coral'
                        ? 'bg-primary/10 text-primary border border-primary/20 font-medium'
                        : 'bg-secondary text-secondary-foreground border border-border/60'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Portal Switcher */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSwitchToHostPortal}
            className="w-full py-2.5 px-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/70 text-foreground text-xs font-medium transition-all flex items-center justify-between cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
              <span>Organizer Studio</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-border/60 bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xs shadow-xs">
              SA
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-foreground truncate">
                {adminName}
              </span>
              <span className="block text-[10px] text-primary truncate font-medium">
                Administrator
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('memora_token');
              localStorage.removeItem('memora_user');
              router.push('/login');
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
