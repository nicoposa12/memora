'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Camera, 
  QrCode, 
  Image as ImageIcon, 
  TrendingUp, 
  HardDrive, 
  Settings, 
  Crown, 
  LogOut, 
  Plus, 
  ExternalLink,
  Sparkles,
  Sliders,
  FolderOpen,
  ChevronRight,
  ArrowLeftRight,
  ArrowRight
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { isClientRole, isAdminRole, getRoleDisplayName, UserRole, ClientPlan } from '@/types/user';
import { getScopedEvents } from '@/lib/userEvents';
import { formatFirstName } from '@/lib/utils';

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeColor?: 'gold' | 'default';
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Studio Organizer');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [userPlan, setUserPlan] = useState<ClientPlan>('event');
  const [firstEventSlug, setFirstEventSlug] = useState<string | null>(null);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('memora_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.firstName) setUserName(parsed.firstName);
        else if (parsed.name) setUserName(formatFirstName(parsed));
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.role) setUserRole(parsed.role);
        if (parsed.plan) setUserPlan(parsed.plan);
      }
    } catch {
      // fallback defaults
    }

    try {
      const events = getScopedEvents();
      if (Array.isArray(events) && events.length > 0 && events[0].slug) {
        setFirstEventSlug(events[0].slug);
      } else {
        setFirstEventSlug(null);
      }
    } catch {}
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('memora_token');
      localStorage.removeItem('memora_user');
    } catch {}
    router.push('/login');
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Workspace',
      items: [
        {
          label: 'Overview',
          href: '/dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          label: 'Events',
          href: '/dashboard/events',
          icon: Calendar,
          badge: null,
        },
        {
          label: 'Photobooths',
          href: '/dashboard/booths',
          icon: Sparkles,
          badge: null,
        },
        {
          label: 'Gallery',
          href: '/dashboard/gallery',
          icon: ImageIcon,
          badge: null,
          external: false,
        },
        {
          label: 'Live Kiosk',
          href: firstEventSlug ? `/e/${firstEventSlug}` : '/dashboard/booths',
          icon: Camera,
          badge: null,
          external: !!firstEventSlug,
        },
      ],
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'Templates',
          href: '/dashboard/templates',
          icon: Sliders,
          badge: null,
        },
        {
          label: 'QR Codes',
          href: '/dashboard/qr-studio',
          icon: QrCode,
          badge: null,
        },
        {
          label: 'Storage',
          href: '/dashboard/storage',
          icon: HardDrive,
          badge: null,
        },
        {
          label: 'Analytics',
          href: '/dashboard/analytics',
          icon: TrendingUp,
          badge: null,
        },
      ],
    },
    {
      label: 'Account',
      items: [
        {
          label: 'Settings',
          href: '/dashboard/settings',
          icon: Settings,
          badge: null,
        },
        {
          label: 'Billing & Plan',
          href: '/dashboard/billing',
          icon: Crown,
          badge: isAdminRole(userRole) ? null : (userPlan === 'studio' ? 'Studio' : 'Pro'),
          badgeColor: 'gold',
        },
      ],
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-card border-r border-border text-foreground select-none">
      {/* Top Brand Header */}
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={onCloseMobile}
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
          title="Return to homepage"
        >
          <Logo className="w-7 h-7 text-primary transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-[0.1em] font-normal text-foreground group-hover:text-primary transition-colors">
                MEMORA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-medium">
                {isAdminRole(userRole) ? 'ADMIN' : 'STUDIO'}
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/80">
              {isAdminRole(userRole) ? 'Admin Portal' : 'Event Studio'}
            </p>
          </div>
        </Link>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/dashboard/events/create" onClick={onCloseMobile} className="block">
          <button className="w-full py-2.5 px-4 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-[0.14em] font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Event</span>
          </button>
        </Link>
      </div>

      {/* Navigation Links Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-6 scrollbar-none">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/75 font-semibold block mb-2">
              {group.label}
            </span>

            {group.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={itemIdx}
                  href={item.href}
                  onClick={onCloseMobile}
                  target={item.external ? '_blank' : undefined}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-secondary text-foreground font-semibold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                    <span className="tracking-wide text-[12px]">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase ${
                      item.badgeColor === 'gold'
                        ? 'bg-primary/10 text-primary border border-primary/20 font-medium'
                        : 'bg-secondary text-secondary-foreground border border-border/60 font-medium'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.external && (
                    <ExternalLink className="w-3 h-3 text-muted-foreground/60 group-hover:text-muted-foreground ml-1 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Live Booth Badge Card */}
        <div className="px-1 pt-2">
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-foreground font-semibold truncate">
                Live Camera Service
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                System Online & Ready
              </p>
            </div>
          </div>
        </div>

        {/* Differentiated Role Display: System Admin (Admin Only) vs Event Organizer Features */}
        {isAdminRole(userRole) ? (
          <div className="px-1 pt-1">
            <Link
              href="/admin"
              className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/70 text-foreground transition-all flex items-center justify-between group block"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      System Admin
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-primary/15 text-[8px] font-mono text-primary font-bold uppercase">
                      Owner
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground truncate block">
                    Admin Console & Settings
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </div>
        ) : (
          <div className="px-1 pt-1">
            <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {userPlan === 'studio' ? 'STUDIO Active' : (userPlan === 'pro' || userPlan === 'event') ? 'PRO Active' : 'Free Trial'}
                  </span>
                </span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {isAdminRole(userRole) ? 'Unlimited (Admin)' : userPlan === 'free' ? '3 Test Strips' : 'Unlimited'}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {userPlan === 'free' 
                  ? 'Upgrade to Pro for unlimited guest photos and no watermarks.'
                  : userPlan === 'studio'
                  ? 'Studio plan active: all events covered with no watermarks.'
                  : 'Pro active: unlimited photos and no watermark.'}
              </p>
              <Link
                href="/dashboard/billing"
                className="w-full py-2 px-3 rounded-full bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer font-medium"
              >
                <span>{userPlan === 'free' ? 'Upgrade to Pro (₱1,499)' : 'Manage Subscription'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Organizer Profile Section */}
      <div className="p-3.5 border-t border-border/60 bg-secondary/30">
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
              {getInitials(userName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {userName}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out of Studio"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
