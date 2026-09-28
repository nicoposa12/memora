import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e6c687]/60 focus:ring-offset-[#07080b] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer tracking-wide";

    const variantStyles = {
      primary: "bg-[#e6c687] hover:bg-[#d9b876] text-[#07080b] font-semibold shadow-[0_4px_20px_rgba(230,198,135,0.22)] border border-[#fff2d6]/50",
      secondary: "bg-[#111520] hover:bg-[#171d2b] text-slate-200 border border-white/[0.08] shadow-sm",
      outline: "border border-white/15 text-slate-200 hover:border-[#e6c687]/60 hover:text-[#e6c687] hover:bg-white/[0.03]",
      ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
      glow: "bg-gradient-to-r from-[#fff2d6] via-[#e6c687] to-[#d4af37] text-[#07080b] font-bold shadow-[0_0_25px_rgba(230,198,135,0.35)] hover:shadow-[0_0_35px_rgba(230,198,135,0.55)] hover:brightness-105 border border-white/40",
      glass: "bg-white/[0.06] hover:bg-white/[0.1] text-white backdrop-blur-md border border-white/10 shadow-lg",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 border border-rose-500/30",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4 py-2.5 rounded-xl gap-2",
      lg: "text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold",
      icon: "p-2.5 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
