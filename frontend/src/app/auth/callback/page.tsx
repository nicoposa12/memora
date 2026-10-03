'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { isAdminRole } from '@/types/user';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
      return;
    }

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      setError('Missing authentication tokens. Please try signing in again.');
      return;
    }

    try {
      const user = JSON.parse(userParam);
      localStorage.setItem('memora_token', token);
      localStorage.setItem('memora_user', JSON.stringify(user));

      // 1. Synchronize user into real customer records
      try {
        const { createOrUpdateCustomerFromUser } = require('@/lib/adminRecords');
        createOrUpdateCustomerFromUser(user);
      } catch {}

      // 2. Broadcast realtime event so any open Admin tabs update in real time
      try {
        const { broadcastRealtime } = require('@/lib/realtime');
        broadcastRealtime('USER_UPDATED', user);
        broadcastRealtime('ACTIVITY_LOGGED', {
          event: `User authenticated: ${user.name || user.email}`,
          actor: user.name || user.email,
          severity: 'info',
        });
      } catch {}

      const redirectTarget = searchParams.get('redirect');
      const isSafeRedirect =
        redirectTarget &&
        redirectTarget.startsWith('/') &&
        !redirectTarget.startsWith('//') &&
        !redirectTarget.startsWith('/\\');

      if (isSafeRedirect) {
        router.replace(redirectTarget);
      } else if (isAdminRole(user.role)) {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch {
      setError('Unable to parse user authentication data.');
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="w-full max-w-[420px] mx-auto text-center p-8 bg-card border border-border/80 rounded-3xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-light text-foreground mb-2">
          Authentication Failed
        </h1>
        <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6">
          {error}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.15em] hover:bg-primary/90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto text-center p-8 bg-card border border-border/80 rounded-3xl shadow-sm">
      <Logo className="w-10 h-10 mx-auto mb-4 animate-pulse" />
      <h1 className="font-display text-2xl font-light text-foreground mb-2">
        Signing you in
      </h1>
      <p className="text-xs text-muted-foreground font-light leading-relaxed">
        Completing secure sign-in with your Google account...
      </p>
      <div className="mt-6 flex justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center px-4 py-12 relative">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
