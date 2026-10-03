'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Check, 
  Calendar, 
  HardDrive,
  UserPlus
} from 'lucide-react';
import { getRealCustomers, saveRealCustomers, recordRealAuditLog, fetchBackendCustomers, RealCustomerRecord } from '@/lib/adminRecords';
import { useModal } from '@/context/ModalContext';
import { useRealtime } from '@/context/RealtimeContext';
import { apiClient } from '@/lib/api';
import { broadcastRealtime } from '@/lib/realtime';

export default function AdminCustomersPage() {
  const { confirm: confirmModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'Free Trial' | 'Event Pass' | 'Studio Pro'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customers, setCustomers] = useState<RealCustomerRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = React.useCallback(async () => {
    setCustomers(getRealCustomers());
    setIsLoaded(true);
    try {
      const fresh = await fetchBackendCustomers();
      if (Array.isArray(fresh)) {
        setCustomers(fresh);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  useRealtime(['USER_UPDATED', 'ACTIVITY_LOGGED'], () => {
    loadData();
  });

  const handleUpdateTier = (id: string, newTier: 'Free Trial' | 'Event Pass' | 'Studio Pro') => {
    const target = customers.find(c => c.id === id);
    let expiresAt = target?.subscriptionExpiresAt;
    if (!expiresAt && (newTier === 'Event Pass' || newTier === 'Studio Pro')) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      expiresAt = d.toISOString().split('T')[0];
    }

    const updated = customers.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        tier: newTier,
        subscriptionExpiresAt: newTier === 'Free Trial' ? undefined : expiresAt,
        billingCycle: (newTier === 'Studio Pro' ? 'monthly' : newTier === 'Event Pass' ? 'per_event' : 'none') as 'monthly' | 'annual' | 'per_event' | 'none',
        renewalStatus: 'active' as const,
      };
    });
    setCustomers(updated);
    saveRealCustomers(updated);

    const numericId = id.replace(/\D/g, '');
    if (numericId) {
      const planCode = newTier === 'Studio Pro' ? 'studio' : newTier === 'Event Pass' ? 'pro' : 'none';
      apiClient.put(`/admin/users/${numericId}`, {
        subscription_plan: planCode,
        subscription_status: 'active',
        subscription_expires_at: expiresAt,
      }).catch(() => {});
    }

    recordRealAuditLog(`Account ${id} plan changed to ${newTier}`, 'Administrator', 'info');
    broadcastRealtime('USER_UPDATED', { id, email: target?.email, tier: newTier });
    showToast(`Updated account plan to ${newTier}`);
  };

  const handleToggleStatus = async (id: string) => {
    const target = customers.find(c => c.id === id);
    const willSuspend = target?.status === 'active';
    if (willSuspend) {
      const confirmed = await confirmModal({
        title: 'Suspend Account',
        description: `Are you sure you want to suspend "${target?.name || id}"? They will lose access to their studio workspace and photobooths.`,
        confirmText: 'Suspend Account',
        cancelText: 'Cancel',
        variant: 'danger',
        eyebrow: 'ACCOUNT SUSPENSION',
      });
      if (!confirmed) return;
    }
    const newStatus = (willSuspend ? 'suspended' : 'active') as 'active' | 'suspended';
    const updated = customers.map(c =>
      c.id === id
        ? { ...c, status: newStatus }
        : c
    );
    setCustomers(updated);
    saveRealCustomers(updated);

    const numericId = id.replace(/\D/g, '');
    if (numericId) {
      try {
        await apiClient.put(`/admin/users/${numericId}`, {
          subscription_status: newStatus,
        });
      } catch {}
    }

    recordRealAuditLog(`Account ${id} status set to ${newStatus}`, 'Administrator', willSuspend ? 'warn' : 'info');
    broadcastRealtime('USER_UPDATED', { id, email: target?.email, status: newStatus });
    showToast(`Account status updated to ${newStatus}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTierFilter === 'all' || c.tier === selectedTierFilter;

    return matchesSearch && matchesTier;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Accounts
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            Organizers
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal">
            View and manage all registered event organizer accounts and their subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border/70 text-xs text-muted-foreground shadow-2xs font-medium">
            Total: <strong className="text-foreground">{customers.length} organizer{customers.length === 1 ? '' : 's'}</strong>
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in shadow-2xs font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      {customers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border/70 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or studio..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/40 border border-border/70 rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: 'all', label: 'All Accounts' },
              { id: 'Free Trial', label: 'Free Trial' },
              { id: 'Event Pass', label: 'Event Pass (₱1,499)' },
              { id: 'Studio Pro', label: 'Studio Pro (₱4,999)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTierFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer shadow-2xs font-medium ${
                  selectedTierFilter === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/70 hover:bg-secondary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customers Content */}
      {filteredCustomers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-dashed border-border/80 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-medium">No organizers yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              When people sign up to host photobooths, you will see their accounts, events, and subscription status listed here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs hover:bg-primary/90 transition-all shadow-xs cursor-pointer font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create an Organizer Account</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border/70 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border/70 text-muted-foreground uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Organizer</th>
                  <th className="py-3.5 px-4 font-semibold">Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Events & Photos</th>
                  <th className="py-3.5 px-4 font-semibold">Storage</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Customer Name */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-foreground font-sans text-sm">{cust.name}</div>
                      <div className="text-xs text-muted-foreground">{cust.email}</div>
                      <div className="text-xs text-primary mt-0.5 font-display font-medium">{cust.studioName}</div>
                    </td>

                    {/* Role & Tier */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          cust.tier === 'Studio Pro'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : cust.tier === 'Event Pass'
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'bg-secondary text-secondary-foreground border border-border/60'
                        }`}>
                          {cust.tier}
                        </span>
                        <span className="block text-[10px] text-muted-foreground capitalize">
                          {cust.role}
                        </span>
                      </div>
                    </td>

                    {/* Events / Photos */}
                    <td className="py-4 px-4">
                      <div className="text-foreground font-semibold">{cust.activeEvents} active event{cust.activeEvents === 1 ? '' : 's'}</div>
                      <div className="text-xs text-muted-foreground">{cust.totalPhotos} photos taken</div>
                    </td>

                    {/* Storage */}
                    <td className="py-4 px-4">
                      <div className="text-foreground font-semibold">
                        {cust.storageMb >= 1024 
                          ? `${(cust.storageMb / 1024).toFixed(2)} GB` 
                          : `${cust.storageMb} MB`}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Cloud storage</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        cust.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={cust.tier}
                          onChange={(e) => handleUpdateTier(cust.id, e.target.value as any)}
                          aria-label={`Change plan tier for ${cust.name}`}
                          className="bg-card border border-border/80 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
                        >
                          <option value="Free Trial">Free Trial (₱0)</option>
                          <option value="Event Pass">Event Pass (₱1,499 · 1 Month)</option>
                          <option value="Studio Pro">Studio Pro (₱4,999)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cust.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                            cust.status === 'active'
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={cust.status === 'active' ? 'Suspend account' : 'Activate account'}
                        >
                          {cust.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
