'use client';

import { useSessionTimer as useSessionTimerHook } from '@/hooks/timer/session';
import { createContext, useContext } from 'react';

type SessionTimerContextType = ReturnType<typeof useSessionTimerHook>;

export const SessionTimerContext =
  createContext<SessionTimerContextType | null>(null);

// Custom hook to consume the context
export const useSessionTimer = () => {
  const ctx = useContext(SessionTimerContext);
  if (!ctx) {
    throw new Error('useSessionTimer must be used within SessionTimerProvider');
  }
  return ctx;
};
