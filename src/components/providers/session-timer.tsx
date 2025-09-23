'use client';

import React from 'react';
import { useSessionTimer } from '@/hooks/timer/session';
import { SessionTimerContext } from '../contexts/session-timer';

export default function SessionTimer({
  children,
}: {
  children: React.ReactNode;
}) {
  const timer = useSessionTimer();

  return (
    <SessionTimerContext.Provider value={timer}>
      {children}
    </SessionTimerContext.Provider>
  );
}
