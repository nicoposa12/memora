'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Trash2, 
  CheckCircle, 
  Eye, 
  UserX, 
  Check, 
  Camera,
  ShieldCheck
} from 'lucide-react';
import { 
  getRealFlaggedPhotos, 
  saveRealFlaggedPhotos, 
  recordRealAuditLog, 
  RealFlaggedPhoto 
} from '@/lib/adminRecords';
import { useModal } from '@/context/ModalContext';

export default function AdminModerationPage() {
  const { confirm: confirmModal } = useModal();
  const [flaggedPhotos, setFlaggedPhotos] = useState<RealFlaggedPhoto[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFlaggedPhotos(getRealFlaggedPhotos());
    setIsLoaded(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprovePhoto = (id: string) => {
    const updated = flaggedPhotos.map(p => (p.id === id ? { ...p, status: 'resolved' as const } : p));
    setFlaggedPhotos(updated);
    saveRealFlaggedPhotos(updated);
    recordRealAuditLog(`Photo report ${id} marked safe`, 'Administrator', 'info');
    showToast(`Photo marked as safe.`);
  };

  const handleRemovePhoto = (id: string) => {
    const updated = flaggedPhotos.map(p => (p.id === id ? { ...p, status: 'removed' as const } : p));
    setFlaggedPhotos(updated);
    saveRealFlaggedPhotos(updated);
    recordRealAuditLog(`Flagged photo ${id} deleted`, 'Administrator', 'warn');
    showToast(`Photo removed from event gallery.`);
  };

  const handleSuspendOrganizer = async (organizerName: string) => {
    const confirmed = await confirmModal({
      title: 'Suspend Organizer Account',
      description: `Are you sure you want to suspend ${organizerName}'s account? This will immediately pause all their active photobooths and restrict gallery access.`,
      confirmText: 'Suspend Account',
      cancelText: 'Cancel',
      variant: 'danger',
      eyebrow: 'MODERATION ACTION',
    });
    if (confirmed) {
      recordRealAuditLog(`Suspended organizer ${organizerName}`, 'Administrator', 'alert');
      showToast(`Organizer ${organizerName} has been suspended.`);
    }
  };

  const filteredReports = flaggedPhotos.filter(p =>
    filter === 'all' ? true : p.status === filter
  );

  const pendingCount = flaggedPhotos.filter(p => p.status === 'pending').length;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Safety & Review
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground font-medium tracking-tight mt-1">
            Moderation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-normal">
            Review reported photos and make sure guest galleries stay safe and appropriate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border/70 text-xs text-muted-foreground shadow-2xs font-medium">
            Pending review: <strong className="text-primary font-semibold">{pendingCount}</strong>
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in shadow-2xs font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      {flaggedPhotos.length > 0 && (
        <div className="flex items-center gap-2 bg-card border border-border/70 p-1.5 rounded-2xl w-fit shadow-xs">
          {(['all', 'pending', 'resolved'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs capitalize transition-all cursor-pointer shadow-2xs font-medium ${
                filter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              {t === 'all' ? 'All reports' : `${t} reports`}
            </button>
          ))}
        </div>
      )}

      {/* Moderation Queue Content */}
      {filteredReports.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-dashed border-border/80 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-foreground font-medium">No reported photos</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Everything looks clean and safe. There are currently no flagged photos that need review.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report #{report.id}</span>
                  </span>
                  <span className="text-muted-foreground">{report.reportedAt}</span>
                </div>

                {/* Photo Preview Thumbnail */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/50 border border-border/70 mb-3 group shadow-2xs">
                  <img
                    src={report.photoUrl}
                    alt="Reported photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/90 text-rose-700 border border-rose-200 shadow-2xs backdrop-blur-xs capitalize">
                    {report.severity} severity
                  </div>
                  {report.status === 'removed' && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-xs flex items-center justify-center text-rose-700 text-xs font-semibold">
                      Removed from gallery
                    </div>
                  )}
                </div>

                <h3 className="font-display text-xl text-foreground font-medium truncate">
                  {report.eventName}
                </h3>
                <p className="text-xs text-primary mt-0.5 font-medium">
                  Host: {report.organizerName}
                </p>
                <p className="text-xs text-muted-foreground mt-2 bg-secondary/40 p-2.5 rounded-lg border border-border/50 leading-relaxed italic">
                  "{report.flagReason}"
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border/60 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={report.status === 'resolved'}
                    onClick={() => handleApprovePhoto(report.id)}
                    className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-2xs font-medium"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Keep Photo</span>
                  </button>

                  <button
                    type="button"
                    disabled={report.status === 'removed'}
                    onClick={() => handleRemovePhoto(report.id)}
                    className="py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-2xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Remove Photo</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSuspendOrganizer(report.organizerName)}
                  className="w-full py-1.5 rounded-lg bg-secondary/30 hover:bg-rose-50 border border-border/60 hover:border-rose-200 text-muted-foreground hover:text-rose-700 text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs font-medium"
                >
                  <UserX className="w-3 h-3" />
                  <span>Suspend organizer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
