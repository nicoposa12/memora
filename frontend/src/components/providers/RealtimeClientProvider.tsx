'use client';

import React from 'react';
import { RealtimeProvider } from '@/context/RealtimeContext';
import { ModalProvider } from '@/context/ModalContext';

export function RealtimeClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <RealtimeProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </RealtimeProvider>
  );
}
