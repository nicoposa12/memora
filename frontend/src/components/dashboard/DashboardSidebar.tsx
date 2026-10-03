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
import { formatFirstName, cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import { useRealtime } from '@/context/RealtimeContext';

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
  const [userPlan, setUserPlan] = useState<ClientPlan>('free');
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
        
        const hasStudio = (parsed.subscription_plan === 'studio' || parsed.plan === 'studio') &&
          (parsed.subscription_status === 'active' || parsed.subscription_status === 'past_due' || !parsed.subscription_status);
        const hasPro = parsed.subscription_plan === 'pro' || parsed.plan === 'pro';
        if (hasStudio) {
          setUserPlan('studio');
        } else if (hasPro) {
          setUserPlan('pro');
        } else {
          setUserPlan('free');
        }
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

    // Verify and sync authentic plan with backend to prevent client-side bypasses
    if (typeof window !== 'undefined' && localStorage.getItem('memora_token')) {
      apiClient.get('/auth/me')
        .then((res) => {
          const me = res.data?.user;
          if (!me) return;

          if (me.subscription_status === 'suspended') {
            localStorage.removeItem('memora_token');
            localStorage.removeItem('memora_user');
            window.location.href = '/login?error=' + encodeURIComponent('Your account has been suspended. Please contact support.');
            return;
          }

          const adminUser = isAdminRole(me.role) || me.role === 'admin';
          const hasStudio = me.subscription_plan === 'studio' && (me.subscription_status === 'active' || me.subscription_status === 'past_due');
          const hasPro = me.subscription_plan === 'pro';
          const realPlan: ClientPlan = adminUser ? 'studio' : hasStudio ? 'studio' : hasPro ? 'pro' : 'free';

          setUserPlan(realPlan);
          if (me.role) setUserRole(me.role);
          if (me.name) setUserName(formatFirstName(me));
          if (me.email) setUserEmail(me.email);

          const raw = localStorage.getItem('memora_user');
          const parsed = raw ? JSON.parse(raw) : {};
          parsed.role = me.role;
          parsed.subscription_plan = me.subscription_plan;
          parsed.subscription_status = me.subscription_status;
          parsed.subscription_expires_at = me.subscription_expires_at;
          parsed.subscription_grace_until = me.subscription_grace_until;
          parsed.plan = realPlan;
          localStorage.setItem('memora_user', JSON.stringify(parsed));
        })
        .catch((err) => {
          const status = err.response?.status;
          const msg = err.message || '';
          if (status === 401 || msg.includes('Unauthenticated') || msg.includes('session is no longer active')) {
            localStorage.removeItem('memora_token');
            localStorage.removeItem('memora_user');
            window.location.href = '/login?error=' + encodeURIComponent('This account has been removed. Please authenticate again.');
          } else if (status === 403 && msg.toLowerCase().includes('suspended')) {
            localStorage.removeItem('memora_token');
            localStorage.removeItem('memora_user');
            window.location.href = '/login?error=' + encodeURIComponent('Your account has been suspended. Please contact support.');
          }
        });
    }
  };

  useRealtime(['USER_UPDATED'], (msg) => {
    try {
      const stored = localStorage.getItem('memora_user');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const myEmail = (parsed.email || '').toLowerCase().trim();
      const payloadEmail = (msg.payload?.email || '').toLowerCase().trim();
      const payloadId = String(msg.payload?.id || '').replace(/\D/g, '');
      const myId = String(parsed.id || '').replace(/\D/g, '');

      const isMe = (payloadEmail && payloadEmail === myEmail) || (payloadId && myId && payloadId === myId);

      if (isMe) {
        if (msg.payload?.type === 'deleted') {
          localStorage.removeItem('memora_token');
          localStorage.removeItem('memora_user');
          window.location.href = '/login?error=' + encodeURIComponent('This account has been deleted by an administrator. Please authenticate again.');
          return;
        }
        if (msg.payload?.status === 'suspended') {
          localStorage.removeItem('memora_token');
          localStorage.removeItem('memora_user');
          window.location.href = '/login?error=' + encodeURIComponent('Your account has been suspended. Please contact support.');
          return;
        }
        loadUserData();
      }
    } catch {}
  });

  useEffect(() => {
    loadUserData();
    const interval = setInterval(loadUserData, 3000);
    window.addEventListener('storage', loadUserData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', loadUserData);
    };
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
          badge: null,
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
  const isSysAdmin = isAdminRole(userRole);

  const planBadge = (() => {
    if (isSysAdmin) {
      return {
        label: 'Admin',
        className: 'bg-primary/15 text-primary border-primary/25',
      };
    }
    if (userPlan === 'studio') {
      return {
        label: 'Studio',
        className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      };
    }
    if (userPlan === 'pro') {
      return {
        label: 'Pro',
        className: 'bg-primary/10 text-primary border-primary/25',
      };
    }
    return {
      label: 'Free',
      className: 'bg-secondary text-muted-foreground border-border/70',
    };
  })();
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
              {isAdminRole(userRole) && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-medium">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/80">
              {isAdminRole(userRole) ? 'Admin Portal' : 'Event Workspace'}
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

        {/* Differentiated Role Display: System Admin (Admin Only) vs Event Organizer Features */}
        {isSysAdmin ? (
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
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  {userPlan === 'studio' ? 'STUDIO Active' : userPlan === 'pro' ? 'PRO Active' : 'Free Account'}
                </span>
                {userPlan !== 'free' && (
                  <span className="text-[9px] font-mono text-muted-foreground">Unlimited</span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {userPlan === 'free' 
                  ? 'Purchase an event pass or monthly studio plan to host events.'
                  : userPlan === 'studio'
                  ? 'All events covered under your active Studio workspace.'
                  : 'Pro active for your event with zero watermark.'}
              </p>
              <Link
                href="/dashboard/billing"
                className="w-full py-2 px-3 rounded-full bg-foreground text-background hover:bg-foreground/90 font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer font-medium"
              >
                <span>{userPlan === 'free' ? 'Choose Plan' : 'Manage Subscription'}</span>
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
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {userName}
                </p>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider shrink-0 border leading-none select-none",
                    planBadge.className
                  )}
                  title={`Plan: ${planBadge.label}`}
                >
                  {planBadge.label}
                </span>
              </div>
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
