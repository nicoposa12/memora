'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Receipt, 
  CheckCircle2, 
  Download, 
  Calendar 
} from 'lucide-react';
import { 
  getRealTransactions, 
  getRealCustomers, 
  isAdminRecord,
  RealTransaction, 
  RealCustomerRecord 
} from '@/lib/adminRecords';
import { useModal } from '@/context/ModalContext';
import { usePlans } from '@/lib/plans';

export default function AdminRevenuePage() {
  const { plans } = usePlans();
  const { alert: alertModal } = useModal();
  const [transactions, setTransactions] = useState<RealTransaction[]>([]);
  const [customers, setCustomers] = useState<RealCustomerRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTransactions(getRealTransactions());
    setCustomers(getRealCustomers());
    setIsLoaded(true);
  }, []);

  // Strictly filter out administrator accounts from revenue, subscribers, and transaction records
  const organizerCustomers = customers.filter(c => !isAdminRecord(c));
  const organizerTransactions = transactions.filter(t => !isAdminRecord({ name: t.host }));

  const proCount = organizerCustomers.filter(c => c.tier === 'Studio Pro' || c.tier === 'STUDIO').length;
  const passCount = organizerCustomers.filter(c => c.tier === 'Event Pass' || c.tier === 'PRO').length;
  const studioPrice = plans.studio?.price || 4999;
  const proPrice = plans.pro?.price || 1499;
  const mrrAmount = proCount * studioPrice;
  const passGrossRevenue = passCount * proPrice;
  const totalRecordedRevenue = organizerTransactions.reduce((acc, t) => acc + (t.amountNum || 0), 0) + passGrossRevenue + mrrAmount;
  const totalUsers = organizerCustomers.length;
  const payingUsers = proCount + passCount;
  const conversionRate = totalUsers > 0 ? ((payingUsers / totalUsers) * 100).toFixed(1) : '0.0';

  const handleExportCsv = async () => {
    if (organizerTransactions.length === 0) {
      await alertModal({
        title: 'No Transactions',
        description: 'There are no recorded transactions or ledger entries to export yet.',
        buttonText: 'Understood',
        variant: 'info',
        eyebrow: 'EXPORT NOTICE',
      });
      return;
    }
    const header = 'ID,Host,Event,Plan,Amount,Status,Date\n';
    const rows = organizerTransactions.map(t => `"${t.id}","${t.host}","${t.event}","${t.plan}","${t.amount}","${t.status}","${t.date}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memora-revenue-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Finance & Subscriptions
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight mt-1 font-normal">
            Platform Revenue & Transactions
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-normal">
            Live overview of {plans.pro.name} ({plans.pro.priceDisplay}) and {plans.studio.name} ({plans.studio.priceDisplay}/mo).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/plans"
            className="px-4 py-2.5 rounded-xl border border-border/70 hover:bg-muted/50 text-foreground text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Manage Plans & Features</span>
          </Link>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl border border-border/70 hover:bg-muted/50 text-foreground text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Transactions CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all">
          <span className="text-xs font-medium text-muted-foreground block mb-1">Monthly Revenue</span>
          <div className="font-display text-4xl text-primary font-medium">₱{mrrAmount.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <span>From {proCount} active Studio account{proCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all">
          <span className="text-xs font-medium text-muted-foreground block mb-1">{plans.pro.name} ({plans.pro.priceDisplay})</span>
          <div className="font-display text-4xl text-foreground font-medium">{passCount} <span className="text-xs font-normal text-muted-foreground">sold</span></div>
          <div className="mt-2 text-xs text-muted-foreground">₱{passGrossRevenue.toLocaleString()} in total sales</div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs hover:border-purple-300 transition-all">
          <span className="text-xs font-medium text-muted-foreground block mb-1">{plans.studio.name} ({plans.studio.priceDisplay})</span>
          <div className="font-display text-4xl text-purple-700 font-medium">{proCount} <span className="text-xs font-normal text-muted-foreground">active</span></div>
          <div className="mt-2 text-xs text-muted-foreground">₱{(proCount * plans.studio.price).toLocaleString()} per month</div>
        </div>

        <div className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-xs font-medium text-muted-foreground block mb-1">Paid Conversion</span>
          <div className="font-display text-4xl text-emerald-700 font-medium">{conversionRate}%</div>
          <div className="mt-2 text-xs text-emerald-700">{payingUsers} of {totalUsers} accounts are on a paid plan</div>
        </div>
      </div>

      {/* Transactions Table / Empty State */}
      <div className="bg-card border border-border/70 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <h3 className="font-display text-xl text-foreground font-medium">Recent Payments</h3>
          </div>
          <span className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment sync active</span>
          </span>
        </div>

        {organizerTransactions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-secondary/20 border border-dashed border-border/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg text-foreground font-medium">No payments yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              When organizers purchase an Event Pass or upgrade to Studio Pro, their payment receipts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/70 bg-secondary/30">
                <tr>
                  <th className="py-3 px-3">Receipt</th>
                  <th className="py-3 px-3">Organizer & Event</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {organizerTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-primary">{tx.id}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-foreground font-medium block">{tx.host}</span>
                      <span className="text-xs text-muted-foreground">{tx.event}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground border border-border/60">
                        {tx.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-foreground font-semibold">{tx.amount}</td>
                    <td className="py-3.5 px-3 text-muted-foreground">{tx.method}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
