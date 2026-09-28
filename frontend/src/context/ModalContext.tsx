'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Trash2, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export interface ConfirmModalOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  eyebrow?: string;
}

export interface AlertModalOptions {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  eyebrow?: string;
}

interface ModalContextValue {
  confirm: (options: ConfirmModalOptions | string) => Promise<boolean>;
  alert: (options: AlertModalOptions | string) => Promise<void>;
}

const ModalContext = createContext<ModalContextValue>({
  confirm: async () => false,
  alert: async () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(true);
  const [modalOptions, setModalOptions] = useState<ConfirmModalOptions>({});

  const resolveCallbackRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmModalOptions | string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolveCallbackRef.current = resolve;
      setIsConfirm(true);
      if (typeof options === 'string') {
        setModalOptions({
          title: 'Confirm Action',
          description: options,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          variant: 'danger',
          eyebrow: 'CONFIRMATION',
        });
      } else {
        setModalOptions({
          title: options.title || 'Confirm Action',
          description: options.description || 'Are you sure you want to proceed?',
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          variant: options.variant || 'danger',
          eyebrow: options.eyebrow || (options.variant === 'danger' ? 'DELETION CONFIRMATION' : 'CONFIRM ACTION'),
        });
      }
      setIsOpen(true);
    });
  }, []);

  const alertModal = useCallback((options: AlertModalOptions | string): Promise<void> => {
    return new Promise<void>((resolve) => {
      resolveCallbackRef.current = () => resolve();
      setIsConfirm(false);
      if (typeof options === 'string') {
        setModalOptions({
          title: 'Notice',
          description: options,
          confirmText: 'Dismiss',
          variant: 'info',
          eyebrow: 'SYSTEM NOTICE',
        });
      } else {
        setModalOptions({
          title: options.title || 'Notice',
          description: options.description || '',
          confirmText: options.buttonText || 'Understood',
          variant: options.variant || 'info',
          eyebrow: options.eyebrow || 'SYSTEM NOTICE',
        });
      }
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveCallbackRef.current?.(true);
    resolveCallbackRef.current = null;
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveCallbackRef.current?.(false);
    resolveCallbackRef.current = null;
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const variant = modalOptions.variant || (isConfirm ? 'danger' : 'info');

  return (
    <ModalContext.Provider value={{ confirm, alert: alertModal }}>
      {children}

      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Backdrop overlay */}
          <div 
            onClick={handleCancel}
            className="fixed inset-0 bg-transparent cursor-pointer"
            aria-hidden="true"
          />

          {/* Luxury Minimalist Card */}
          <div className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 ring-1 ring-border/20 z-10">
            {/* Close button top right */}
            <button
              onClick={handleCancel}
              className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Icon + Eyebrow */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                variant === 'danger'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : variant === 'warning'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : variant === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-primary/10 text-primary border-primary/20'
              }`}>
                {variant === 'danger' && <Trash2 className="w-4 h-4" />}
                {variant === 'warning' && <AlertTriangle className="w-4 h-4" />}
                {variant === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {variant === 'info' && <Info className="w-4 h-4" />}
              </div>

              <div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] font-semibold block ${
                  variant === 'danger'
                    ? 'text-rose-600 dark:text-rose-400'
                    : variant === 'warning'
                    ? 'text-amber-600 dark:text-amber-400'
                    : variant === 'success'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-primary'
                }`}>
                  {modalOptions.eyebrow || (isConfirm ? 'CONFIRM ACTION' : 'SYSTEM NOTICE')}
                </span>
                <h3 className="font-display text-2xl font-light text-foreground tracking-tight leading-snug">
                  {modalOptions.title}
                </h3>
              </div>
            </div>

            {/* Body Description */}
            {modalOptions.description && (
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed pl-0.5">
                {modalOptions.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
              {isConfirm && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-full border border-border/80 hover:bg-secondary text-foreground text-xs font-mono uppercase tracking-[0.14em] transition-all cursor-pointer shadow-2xs font-medium"
                >
                  {modalOptions.cancelText || 'Cancel'}
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                autoFocus
                className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.14em] font-semibold transition-all shadow-xs cursor-pointer ${
                  variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-[0.98]'
                    : variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]'
                    : 'bg-foreground hover:bg-foreground/90 text-background active:scale-[0.98]'
                }`}
              >
                {modalOptions.confirmText || (isConfirm ? 'Confirm' : 'Got It')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
