'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { 
  UserCog, 
  Search, 
  Plus, 
  Check, 
  CheckCircle2, 
  X, 
  Crown, 
  Sparkles, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  ArrowUpDown, 
  HardDrive, 
  Camera, 
  ExternalLink, 
  RefreshCw, 
  Edit3, 
  Trash2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  getRealCustomers, 
  saveRealCustomers, 
  createRealCustomer, 
  updateRealCustomer, 
  deleteRealCustomer,
  recordRealAuditLog, 
  isAdminRecord, 
  RealCustomerRecord 
} from '@/lib/adminRecords';
import { useModal } from '@/context/ModalContext';
import { useRealtime } from '@/context/RealtimeContext';
import { broadcastRealtime } from '@/lib/realtime';

export interface ExpirationCountdownInfo {
  daysLeft: number;
  label: string;
  status: 'healthy' | 'expiring_soon' | 'critical' | 'grace_period' | 'expired' | 'no_expiration';
  badgeClass: string;
  barColor: string;
  dotColor: string;
  progressPercent: number;
}

export function getExpirationCountdown(cust: RealCustomerRecord): ExpirationCountdownInfo {
  let expiresAt = cust.subscriptionExpiresAt;
  if (!expiresAt) {
    if (cust.tier === 'Free Trial') {
      return {
        daysLeft: 0,
        label: 'Trial Account',
        status: 'no_expiration',
        badgeClass: 'bg-secondary text-foreground/80 border border-border/80 font-medium',
        barColor: 'bg-muted-foreground/30',
        dotColor: 'bg-muted-foreground',
        progressPercent: 100,
      };
    }
    // For Event Pass (PRO) or Studio Pro missing expiresAt, compute 30 days from joinedDate
    const joined = new Date(cust.joinedDate);
    const target = isNaN(joined.getTime()) ? new Date() : joined;
    target.setDate(target.getDate() + 30);
    expiresAt = target.toISOString().split('T')[0];
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const expireDate = new Date(expiresAt);
  const expiry = new Date(expireDate.getFullYear(), expireDate.getMonth(), expireDate.getDate()).getTime();

  const diffTime = expiry - today;
  const daysLeft = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Check if past expiry
  if (daysLeft < 0) {
    if (cust.subscriptionGraceUntil) {
      const graceDate = new Date(cust.subscriptionGraceUntil);
      const graceExpiry = new Date(graceDate.getFullYear(), graceDate.getMonth(), graceDate.getDate()).getTime();
      const graceDays = Math.round((graceExpiry - today) / (1000 * 60 * 60 * 24));
      if (graceDays >= 0) {
        return {
          daysLeft: graceDays,
          label: graceDays === 0 ? 'Grace ends today' : `${graceDays}d grace left`,
          status: 'grace_period',
          badgeClass: 'bg-orange-100 text-orange-950 border border-orange-400 font-bold dark:bg-orange-950/90 dark:text-orange-100 dark:border-orange-500 shadow-2xs',
          barColor: 'bg-orange-500',
          dotColor: 'bg-orange-600',
          progressPercent: 15,
        };
      }
    }
    const daysAgo = Math.abs(daysLeft);
    return {
      daysLeft,
      label: daysAgo === 0 ? 'Expired today' : `Expired ${daysAgo}d ago`,
      status: 'expired',
      badgeClass: 'bg-rose-100 text-rose-950 border border-rose-400 font-bold dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-500 shadow-2xs',
      barColor: 'bg-rose-500',
      dotColor: 'bg-rose-600',
      progressPercent: 0,
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      label: 'Expires today',
      status: 'critical',
      badgeClass: 'bg-rose-100 text-rose-950 border border-rose-500 font-bold dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-500 shadow-2xs animate-pulse',
      barColor: 'bg-rose-600',
      dotColor: 'bg-rose-600',
      progressPercent: 5,
    };
  }

  if (daysLeft === 1) {
    return {
      daysLeft: 1,
      label: 'Expires tomorrow',
      status: 'critical',
      badgeClass: 'bg-rose-100 text-rose-950 border border-rose-500 font-bold dark:bg-rose-950/90 dark:text-rose-100 dark:border-rose-500 shadow-2xs',
      barColor: 'bg-rose-600',
      dotColor: 'bg-rose-600',
      progressPercent: 10,
    };
  }

  if (daysLeft <= 7) {
    return {
      daysLeft,
      label: `${daysLeft} days left`,
      status: 'expiring_soon',
      badgeClass: 'bg-amber-100 text-amber-950 border border-amber-500 font-bold dark:bg-amber-950/90 dark:text-amber-100 dark:border-amber-500 shadow-2xs',
      barColor: 'bg-amber-500',
      dotColor: 'bg-amber-600',
      progressPercent: Math.max(12, Math.round((daysLeft / 30) * 100)),
    };
  }

  return {
    daysLeft,
    label: `${daysLeft} days left`,
    status: 'healthy',
    badgeClass: 'bg-emerald-100/90 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-600 shadow-2xs',
    barColor: 'bg-emerald-600 dark:bg-emerald-500',
    dotColor: 'bg-emerald-600',
    progressPercent: Math.min(100, Math.round((daysLeft / 30) * 100)),
  };
}

export function getDaysCountdownText(dateStr: string): string {
  if (!dateStr) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(dateStr);
  const targetTime = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const diffTime = targetTime - today;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (days < 0) return `Expired ${Math.abs(days)} day(s) ago`;
  if (days === 0) return 'Expires today (0 days left)';
  if (days === 1) return 'Expires tomorrow (1 day left)';
  return `${days} days left until renewal`;
}

export default function AdminUsersPage() {
  const { confirm: confirmModal } = useModal();
  const [customers, setCustomers] = useState<RealCustomerRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'Studio Pro' | 'Event Pass' | 'Free Trial'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'expiring'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'expiring_first' | 'name' | 'plan' | 'storage'>('newest');

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<RealCustomerRecord | null>(null);

  // Form States for Add User
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserStudio, setNewUserStudio] = useState('');
  const [newUserTier, setNewUserTier] = useState<'Studio Pro' | 'Event Pass' | 'Free Trial'>('Studio Pro');
  const [newUserDuration, setNewUserDuration] = useState<'30days' | '1year' | 'perpetual'>('30days');

  // Form States for Edit Plan Modal
  const [editTier, setEditTier] = useState<'Studio Pro' | 'Event Pass' | 'Free Trial'>('Studio Pro');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  const [editGracePeriodDays, setEditGracePeriodDays] = useState('7');
  const [editStudioName, setEditStudioName] = useState('');

  const loadData = useCallback(() => {
    const list = getRealCustomers().filter(c => !isAdminRecord(c));
    setCustomers(list);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync when realtime user events fire
  useRealtime(['USER_UPDATED', 'ACTIVITY_LOGGED'], () => {
    loadData();
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick Plan Change handler directly from table
  const handleQuickPlanChange = (id: string, newTier: 'Studio Pro' | 'Event Pass' | 'Free Trial') => {
    const target = customers.find(c => c.id === id);
    if (!target) return;

    let expiresAt: string | undefined = target.subscriptionExpiresAt;
    let billingCycle: 'monthly' | 'annual' | 'per_event' | 'none' = 'none';

    if (newTier === 'Studio Pro') {
      billingCycle = 'monthly';
      // Default to 30 days from now if not currently set
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString().split('T')[0];
    } else if (newTier === 'Event Pass') {
      billingCycle = 'per_event';
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString().split('T')[0];
    } else {
      billingCycle = 'none';
      expiresAt = undefined;
    }

    const updated = updateRealCustomer(id, {
      tier: newTier,
      billingCycle,
      subscriptionExpiresAt: expiresAt,
      renewalStatus: 'active',
    });

    if (updated) {
      recordRealAuditLog(`Organizer "${target.name}" (${id}) plan changed to ${newTier}`, 'Administrator', 'info');
      broadcastRealtime('USER_UPDATED', { id, tier: newTier });
      loadData();
      showToast(`Updated ${target.name}'s plan to ${newTier}`);
    }
  };

  // Toggle user active / suspended status
  const handleToggleStatus = async (id: string) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;

    const willSuspend = target.status === 'active';
    if (willSuspend) {
      const confirmed = await confirmModal({
        title: 'Suspend Account',
        description: `Are you sure you want to suspend "${target.name}"? They will temporarily lose access to their photobooths and dashboard.`,
        confirmText: 'Suspend Account',
        cancelText: 'Cancel',
        variant: 'danger',
        eyebrow: 'ACCOUNT STATUS',
      });
      if (!confirmed) return;
    }

    const newStatus: 'active' | 'suspended' = willSuspend ? 'suspended' : 'active';
    updateRealCustomer(id, { status: newStatus });
    recordRealAuditLog(
      `Organizer "${target.name}" (${id}) account status changed to ${newStatus}`,
      'Administrator',
      willSuspend ? 'warn' : 'info'
    );
    broadcastRealtime('USER_UPDATED', { id, status: newStatus });
    loadData();
    showToast(`Account status updated to ${newStatus}`);
  };

  // Permanently delete user account
  const handleDeleteUser = async (id: string) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;

    const confirmed = await confirmModal({
      title: 'Delete User Account',
      description: `Are you sure you want to permanently delete the account for "${target.name}" (${target.email})? This action will remove their studio records and cannot be undone.`,
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      variant: 'danger',
      eyebrow: 'DELETE ACCOUNT',
    });

    if (!confirmed) return;

    const success = deleteRealCustomer(id);
    if (success) {
      recordRealAuditLog(
        `Organizer account for "${target.name}" (${id}, ${target.email}) was permanently deleted`,
        'Administrator',
        'alert'
      );
      broadcastRealtime('USER_UPDATED', { id, type: 'deleted' });
      if (editingCustomer && editingCustomer.id === id) {
        setEditingCustomer(null);
      }
      loadData();
      showToast(`Permanently deleted account for ${target.name}`);
    }
  };

  // Quick 30-Day Extension for Studio Pro subscribers
  const handleExtendSubscription = (id: string, days = 30) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;

    let baseDate = new Date();
    if (target.subscriptionExpiresAt) {
      const existing = new Date(target.subscriptionExpiresAt);
      if (existing > baseDate) {
        baseDate = existing;
      }
    }
    baseDate.setDate(baseDate.getDate() + days);
    const newExpiresAt = baseDate.toISOString().split('T')[0];

    updateRealCustomer(id, {
      subscriptionExpiresAt: newExpiresAt,
      renewalStatus: 'active',
    });

    recordRealAuditLog(
      `Extended subscription for "${target.name}" (${id}) by ${days} days until ${newExpiresAt}`,
      'Administrator',
      'info'
    );
    broadcastRealtime('USER_UPDATED', { id, subscriptionExpiresAt: newExpiresAt });
    loadData();
    showToast(`Added ${days} days to ${target.name}'s subscription (expires ${newExpiresAt})`);
  };

  // Open Edit Modal with preloaded data
  const handleOpenEditModal = (cust: RealCustomerRecord) => {
    setEditingCustomer(cust);
    setEditTier(cust.tier as any);
    setEditStatus(cust.status);
    setEditStudioName(cust.studioName);
    if (!cust.subscriptionExpiresAt && (cust.tier === 'Event Pass' || cust.tier === 'PRO' || cust.tier === 'Studio Pro' || cust.tier === 'STUDIO')) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setEditExpiresAt(d.toISOString().split('T')[0]);
    } else {
      setEditExpiresAt(cust.subscriptionExpiresAt || '');
    }
    setEditGracePeriodDays('7');
  };

  // Submit Edit Modal
  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    let expiresAt = editExpiresAt || undefined;
    if ((editTier === 'Event Pass' || editTier === 'Studio Pro') && !expiresAt) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString().split('T')[0];
    }

    const updates: Partial<RealCustomerRecord> = {
      tier: editTier,
      status: editStatus,
      studioName: editStudioName.trim() || `${editingCustomer.name}'s Studio`,
      subscriptionExpiresAt: expiresAt,
      billingCycle: editTier === 'Studio Pro' ? 'monthly' : editTier === 'Event Pass' ? 'per_event' : 'none',
      renewalStatus: 'active',
    };

    updateRealCustomer(editingCustomer.id, updates);
    recordRealAuditLog(
      `Updated user account & subscription for "${editingCustomer.name}" (${editingCustomer.id})`,
      'Administrator',
      'info'
    );
    broadcastRealtime('USER_UPDATED', { id: editingCustomer.id, ...updates });
    loadData();
    setEditingCustomer(null);
    showToast(`Subscription settings saved for ${editingCustomer.name}`);
  };

  // Submit Add User Modal
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      return;
    }

    let expiresAt: string | undefined = undefined;
    let billingCycle: 'monthly' | 'annual' | 'per_event' | 'none' = 'none';

    if (newUserTier === 'Studio Pro') {
      billingCycle = newUserDuration === '1year' ? 'annual' : 'monthly';
      const d = new Date();
      if (newUserDuration === '30days') d.setDate(d.getDate() + 30);
      else if (newUserDuration === '1year') d.setFullYear(d.getFullYear() + 1);
      else d.setFullYear(d.getFullYear() + 5);
      expiresAt = d.toISOString().split('T')[0];
    } else if (newUserTier === 'Event Pass') {
      billingCycle = 'per_event';
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString().split('T')[0];
    }

    const created = createRealCustomer({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      studioName: newUserStudio.trim() || `${newUserName.trim()}'s Studio`,
      role: 'organizer',
      tier: newUserTier,
      activeEvents: 0,
      totalPhotos: 0,
      storageMb: 0,
      status: 'active',
      subscriptionExpiresAt: expiresAt,
      billingCycle,
      renewalStatus: 'active',
    });

    recordRealAuditLog(
      `Created organizer account for "${created.name}" (${created.email}) with ${newUserTier} plan`,
      'Administrator',
      'info'
    );
    broadcastRealtime('USER_UPDATED', { id: created.id, type: 'created' });
    loadData();

    // Reset & Close
    setNewUserName('');
    setNewUserEmail('');
    setNewUserStudio('');
    setNewUserTier('Studio Pro');
    setNewUserDuration('30days');
    setIsAddUserOpen(false);
    showToast(`Created account for ${created.name} with ${newUserTier} plan`);
  };

  // Filter & Sort Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.studioName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);

      const matchesPlan = 
        planFilter === 'all' || 
        c.tier === planFilter ||
        (planFilter === 'Studio Pro' && (c.tier === 'Studio Pro' || c.tier === 'STUDIO')) ||
        (planFilter === 'Event Pass' && (c.tier === 'Event Pass' || c.tier === 'PRO'));

      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = c.status === 'active';
      else if (statusFilter === 'suspended') matchesStatus = c.status === 'suspended';
      else if (statusFilter === 'expiring') {
        const cd = getExpirationCountdown(c);
        matchesStatus = cd.status === 'expiring_soon' || cd.status === 'critical' || cd.status === 'grace_period';
      }

      return matchesSearch && matchesPlan && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'expiring_first') {
        const aCd = getExpirationCountdown(a);
        const bCd = getExpirationCountdown(b);
        const aDays = a.subscriptionExpiresAt ? aCd.daysLeft : 99999;
        const bDays = b.subscriptionExpiresAt ? bCd.daysLeft : 99999;
        return aDays - bDays;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'plan') return a.tier.localeCompare(b.tier);
      if (sortBy === 'storage') return (b.storageMb || 0) - (a.storageMb || 0);
      return 0; // default newest
    });
  }, [customers, searchQuery, planFilter, statusFilter, sortBy]);

  // Metric Computations
  const totalCount = customers.length;
  const studioProCount = customers.filter(c => c.tier === 'Studio Pro' || c.tier === 'STUDIO').length;
  const proPassCount = customers.filter(c => c.tier === 'Event Pass' || c.tier === 'PRO').length;
  const freeTrialCount = customers.filter(c => c.tier === 'Free Trial').length;
  const activeCount = customers.filter(c => c.status === 'active').length;
  const estimatedMrr = studioProCount * 4999;
  const expiringSoonCount = customers.filter(c => {
    const cd = getExpirationCountdown(c);
    return cd.status === 'expiring_soon' || cd.status === 'critical' || cd.status === 'grace_period';
  }).length;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-card border border-primary/30 text-foreground text-xs shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider block">
            Accounts & Subscriptions
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            Manage Users
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal max-w-2xl leading-relaxed">
            Manage organizer accounts, assign Pro and Studio plans, track subscription renewals, and configure account access.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/plans"
            className="px-4 py-2.5 rounded-xl bg-secondary/70 hover:bg-secondary border border-border text-foreground text-xs font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Plan Matrix</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>

          <button
            type="button"
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accounts */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Total Accounts</span>
            <span className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <UserCog className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-medium text-foreground tracking-tight">
              {totalCount}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {activeCount} Active
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Platform organizers and booth hosts
          </div>
        </div>

        {/* Studio Pro */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Studio Pro Plan</span>
            <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Crown className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-medium text-foreground tracking-tight">
              {studioProCount}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium font-mono">
              ₱{estimatedMrr.toLocaleString()}/mo
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>Multi-booth & custom branding</span>
            {expiringSoonCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {expiringSoonCount} expiring soon
              </span>
            )}
          </div>
        </div>

        {/* Event Pass / Pro */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Event Pass (PRO)</span>
            <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-medium text-foreground tracking-tight">
              {proPassCount}
            </span>
            <span className="text-xs text-primary font-medium font-mono">
              ₱1,499/event
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Unlimited photos, zero watermark, all template designs
          </div>
        </div>

        {/* Free Trial */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Free Trial Accounts</span>
            <span className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-medium text-foreground tracking-tight">
              {freeTrialCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              50 photo cap
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Evaluation tier ready for upgrade
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-card border border-border/70 p-4 sm:p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by organizer name, email, studio, or ID..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/40 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-secondary/40 border border-border/70 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest Joined</option>
              <option value="expiring_first">Days Left (Expiring First)</option>
              <option value="name">Name (A-Z)</option>
              <option value="plan">Plan Tier</option>
              <option value="storage">Storage Used</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mr-1.5 hidden lg:inline">
              Plan:
            </span>
            {[
              { id: 'all', label: `All Plans (${customers.length})` },
              { id: 'Studio Pro', label: `Studio Pro (${studioProCount})` },
              { id: 'Event Pass', label: `Event Pass (${proPassCount})` },
              { id: 'Free Trial', label: `Free Trial (${freeTrialCount})` },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlanFilter(p.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shadow-2xs font-medium ${
                  planFilter === p.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/70 hover:bg-secondary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mr-1.5 hidden lg:inline">
              Status:
            </span>
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'expiring', label: `Expiring Soon (${expiringSoonCount})` },
              { id: 'suspended', label: 'Suspended' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shadow-2xs font-medium ${
                  statusFilter === s.id
                    ? 'bg-foreground text-background'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/70 hover:bg-secondary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-dashed border-border/80 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <UserCog className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-medium">No matching accounts found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {searchQuery || planFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters to find the account you are looking for.'
                : 'No registered organizer accounts found. You can add a new user to grant them access.'}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {(searchQuery || planFilter !== 'all' || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPlanFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-all shadow-2xs cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAddUserOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border/70 text-muted-foreground uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">User & Studio</th>
                  <th className="py-3.5 px-4 font-semibold">Subscription Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Plan Lifecycle & Countdown</th>
                  <th className="py-3.5 px-4 font-semibold">Usage & Quotas</th>
                  <th className="py-3.5 px-4 font-semibold">Account Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredCustomers.map((cust) => {
                  const isStudio = cust.tier === 'Studio Pro' || cust.tier === 'STUDIO';
                  const isPro = cust.tier === 'Event Pass' || cust.tier === 'PRO';
                  const countdown = getExpirationCountdown(cust);

                  return (
                    <tr key={cust.id} className="hover:bg-secondary/20 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs ${
                            isStudio
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : isPro
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-secondary text-foreground border border-border'
                          }`}>
                            {cust.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground text-sm truncate flex items-center gap-1.5">
                              <span>{cust.name}</span>
                              <span className="text-[10px] font-mono text-muted-foreground font-normal">
                                ({cust.id})
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{cust.email}</div>
                            <div className="text-[11px] text-primary/90 mt-0.5 font-medium truncate">
                              {cust.studioName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subscription Plan */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            {isStudio ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
                                <Crown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                <span>Studio Pro</span>
                              </span>
                            ) : isPro ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span>Event Pass (PRO)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/70 shadow-2xs">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span>Free Trial</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Plan Switcher */}
                          <div className="flex items-center gap-1">
                            <select
                              value={cust.tier === 'STUDIO' ? 'Studio Pro' : cust.tier === 'PRO' ? 'Event Pass' : cust.tier}
                              onChange={(e) => handleQuickPlanChange(cust.id, e.target.value as any)}
                              aria-label={`Change plan for ${cust.name}`}
                              className="bg-card border border-border/70 rounded-lg px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
                            >
                              <option value="Studio Pro">Studio Pro (₱4,999/mo)</option>
                              <option value="Event Pass">Event Pass (₱1,499 · 1 Month)</option>
                              <option value="Free Trial">Free Trial (₱0)</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Plan Lifecycle & Countdown */}
                      <td className="py-4 px-4">
                        <div className="space-y-2 min-w-[220px]">
                          {cust.subscriptionExpiresAt || isPro || isStudio ? (
                            <>
                              {/* Top row: Renewal Date + High-Visibility Badge */}
                              <div className="flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold tracking-tight">
                                  <Calendar className="w-4 h-4 text-foreground/60 shrink-0" />
                                  <span>
                                    {new Date(
                                      cust.subscriptionExpiresAt ||
                                      (() => {
                                        const d = new Date(cust.joinedDate);
                                        const t = isNaN(d.getTime()) ? new Date() : d;
                                        t.setDate(t.getDate() + 30);
                                        return t.toISOString();
                                      })()
                                    ).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>

                                {/* High-Visibility Countdown Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs tracking-tight whitespace-nowrap ${countdown.badgeClass}`}>
                                  {countdown.status === 'expiring_soon' || countdown.status === 'critical' ? (
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-900 dark:text-amber-200" />
                                  ) : countdown.status === 'grace_period' ? (
                                    <Clock className="w-3.5 h-3.5 shrink-0 text-orange-900 dark:text-orange-200" />
                                  ) : (
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${countdown.dotColor}`} />
                                  )}
                                  <span>{countdown.label}</span>
                                </span>
                              </div>

                              {/* Middle: Micro Progress Bar with Clean Track */}
                              <div 
                                className="w-full bg-secondary/90 dark:bg-secondary/40 rounded-full h-1.5 overflow-hidden border border-border/60"
                                title={`Billing cycle: ${countdown.daysLeft} days remaining`}
                              >
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${countdown.barColor}`}
                                  style={{ width: `${Math.min(100, Math.max(6, countdown.progressPercent))}%` }}
                                />
                              </div>

                              {/* Bottom: Clear Subtext */}
                              <div className="text-[11px] text-muted-foreground flex items-center justify-between font-medium">
                                <span className="text-muted-foreground/85">
                                  {isStudio ? 'Studio Pro (Monthly)' : isPro ? 'Event Pass (1-Month Pass)' : 'Active billing cycle'}
                                </span>
                                {countdown.daysLeft > 0 && (
                                  <span className="font-mono text-foreground/90 font-medium">
                                    {countdown.daysLeft}d left
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>Trial Account</span>
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                50 photos cap per event
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Usage & Quotas */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="text-foreground font-semibold flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{cust.activeEvents} active event{cust.activeEvents === 1 ? '' : 's'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span>{cust.totalPhotos} photos captured</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                            <HardDrive className="w-3 h-3 text-muted-foreground/80" />
                            <span>
                              {cust.storageMb >= 1024 
                                ? `${(cust.storageMb / 1024).toFixed(2)} GB` 
                                : `${cust.storageMb} MB`} used
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                          cust.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <span>{cust.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Details & Plan */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cust)}
                            className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground border border-border/70 transition-all cursor-pointer shadow-2xs"
                            title="Edit Plan & Subscription details"
                            aria-label={`Edit ${cust.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                          </button>

                          {/* Toggle Active / Suspended */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cust.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                              cust.status === 'active'
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-500/10'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                            }`}
                            title={cust.status === 'active' ? 'Suspend account' : 'Restore account'}
                            aria-label={cust.status === 'active' ? 'Suspend account' : 'Restore account'}
                          >
                            {cust.status === 'active' ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Account */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(cust.id)}
                            className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-all cursor-pointer shadow-2xs"
                            title={`Delete account for ${cust.name}`}
                            aria-label={`Delete account for ${cust.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddUserOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider block">
                  New Account
                </span>
                <h3 className="text-xl font-display font-medium text-foreground">
                  Add Organizer User
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Maria Clara Santos"
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="maria@photobooth.ph"
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Studio or Company Name
                </label>
                <input
                  type="text"
                  value={newUserStudio}
                  onChange={(e) => setNewUserStudio(e.target.value)}
                  placeholder="e.g. Lumina Photobooth Studio"
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Initial Plan Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Studio Pro', label: 'Studio Pro', price: '₱4,999/mo', desc: 'Full workspace' },
                    { id: 'Event Pass', label: 'Event Pass', price: '₱1,499 (1 Month)', desc: '1 month access' },
                    { id: 'Free Trial', label: 'Free Trial', price: '₱0', desc: '50 photos' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setNewUserTier(tier.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        newUserTier === tier.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/70 bg-secondary/30 text-foreground hover:bg-secondary'
                      }`}
                    >
                      <div className="font-semibold text-xs">{tier.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{tier.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Duration if Studio Pro */}
              {newUserTier === 'Studio Pro' && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Subscription Duration
                  </label>
                  <select
                    value={newUserDuration}
                    onChange={(e) => setNewUserDuration(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="30days">1 Month (30 Days)</option>
                    <option value="1year">1 Year (Annual Subscription)</option>
                    <option value="perpetual">Unlimited / VIP Grant</option>
                  </select>
                </div>
              )}

              {/* Notice for Event Pass 1 Month Expiration */}
              {newUserTier === 'Event Pass' && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Pass Validity:</span>
                  </span>
                  <span className="font-semibold text-primary font-mono">1 Month (30 Days Expiration)</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PLAN & SUBSCRIPTION */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-foreground/40 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingCustomer(null)}
          />
          <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[11px] font-medium text-primary uppercase tracking-wider block">
                  Subscription Settings
                </span>
                <h3 className="text-xl font-display font-medium text-foreground">
                  Manage Plan: {editingCustomer.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Studio Name
                </label>
                <input
                  type="text"
                  value={editStudioName}
                  onChange={(e) => setEditStudioName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Assigned Subscription Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Studio Pro', label: 'Studio Pro', price: '₱4,999/mo' },
                    { id: 'Event Pass', label: 'Event Pass', price: '₱1,499 (1 Month)' },
                    { id: 'Free Trial', label: 'Free Trial', price: '₱0' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setEditTier(p.id as any);
                        if ((p.id === 'Studio Pro' || p.id === 'Event Pass') && !editExpiresAt) {
                          const d = new Date();
                          d.setDate(d.getDate() + 30);
                          setEditExpiresAt(d.toISOString().split('T')[0]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        editTier === p.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/70 bg-secondary/30 text-foreground hover:bg-secondary'
                      }`}
                    >
                      <div className="font-semibold text-xs">{p.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Plan Expiration / Renewal Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={editExpiresAt}
                    onChange={(e) => setEditExpiresAt(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 30);
                      setEditExpiresAt(d.toISOString().split('T')[0]);
                    }}
                    className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border/70 cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    +30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setFullYear(d.getFullYear() + 1);
                      setEditExpiresAt(d.toISOString().split('T')[0]);
                    }}
                    className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border/70 cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    +1 Year
                  </button>
                </div>

                {editExpiresAt && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-400/60 dark:border-amber-600 flex items-center justify-between text-xs">
                    <span className="text-amber-950 dark:text-amber-100 flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-amber-700 dark:text-amber-300 shrink-0" />
                      <span>Countdown to Expiration:</span>
                    </span>
                    <span className="font-bold text-amber-950 dark:text-amber-100 font-mono text-xs">
                      {getDaysCountdownText(editExpiresAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Account Access Status */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="active">Active (Normal access to photobooths & studio)</option>
                  <option value="suspended">Suspended (Access paused)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => handleDeleteUser(editingCustomer.id)}
                  className="px-3.5 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Plan Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
