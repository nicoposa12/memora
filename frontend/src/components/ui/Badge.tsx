import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'success' | 'warning' | 'champagne';
}

export function Badge({
  className,
  variant = 'primary',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#e6c687]/15 text-[#e6c687] border-[#e6c687]/30",
    secondary: "bg-white/[0.05] text-slate-300 border-white/10",
    outline: "bg-transparent text-slate-400 border-white/15",
    gradient: "bg-gradient-to-r from-[#e6c687]/20 via-[#fdf6e7]/15 to-[#e6c687]/10 text-[#fcedc5] border-[#e6c687]/30 shadow-[0_0_15px_rgba(230,198,135,0.12)]",
    champagne: "bg-[#e6c687]/20 text-[#fff2d6] border-[#e6c687]/40 shadow-sm",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
