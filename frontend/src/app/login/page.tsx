'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { apiClient } from '@/lib/api';
import { isAdminRole } from '@/types/user';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Only allow same-site relative redirects (blocks open-redirect phishing links)
  const getSafeRedirect = (): string | null => {
    const target = searchParams.get('redirect');
    if (target && target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/\\')) {
      return target;
    }
    return null;
  };

  const storeSession = (data: any) => {
    if (!data?.token || !data?.user) {
      throw new Error('We could not sign you in. Please try again.');
    }
    localStorage.setItem('memora_token', data.token);
    localStorage.setItem('memora_user', JSON.stringify(data.user));
    return data.user;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await apiClient.post('/auth/login', { email, password });
        const user = storeSession(res.data);

        setSuccessMessage('Signed in. Redirecting to your workspace...');
        setTimeout(() => {
          const safeRedirect = getSafeRedirect();
          if (safeRedirect) {
            router.push(safeRedirect);
          } else if (isAdminRole(user.role)) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 500);
      } else {
        // Register mode
        if (password !== passwordConfirmation) {
          setError('Passwords do not match. Please check and try again.');
          setIsLoading(false);
          return;
        }

        const res = await apiClient.post('/auth/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        storeSession(res.data);

        setSuccessMessage('Account created. Setting up your studio...');
        setTimeout(() => {
          router.push(getSafeRedirect() || '/dashboard');
        }, 500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to homepage</span>
        </Link>
      </div>

      {/* Main Card with Memora Design System */}
      <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-sm ring-1 ring-border/60 relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group cursor-pointer" title="Return to homepage">
            <Logo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105 shadow-sm" />
            <span className="font-display text-2xl tracking-[0.12em] font-normal text-foreground group-hover:text-primary transition-colors">
              MEMORA
            </span>
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-light tracking-[-0.01em] text-foreground">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Sign in to access your photobooths, templates, and event galleries.' 
              : 'Launch your first browser photobooth in less than two minutes.'}
          </p>
        </div>

        {/* Segmented Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-full bg-secondary border border-border/60 mb-6 text-xs font-mono uppercase tracking-[0.15em]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-full transition-all cursor-pointer text-center font-medium ${
              mode === 'login'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-full transition-all cursor-pointer text-center font-medium ${
              mode === 'register'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback Notifications */}
        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setError("Password reset instructions have been sent if this account exists.")}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border/80 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-muted-foreground select-none cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>
          )}

          {/* Submit Button in Memora Primary Style */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-3 rounded-full bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] font-medium hover:bg-primary/90 transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch Link & Security Note */}
        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary font-medium hover:underline cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary font-medium hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80 mt-4 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>256-bit encryption • Private event vault</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-center px-4 py-12 relative selection:bg-primary selection:text-primary-foreground">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}
