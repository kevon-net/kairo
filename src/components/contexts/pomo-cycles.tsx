'use client';

import { usePomoCycles } from '@/hooks/pomo';
import React, { useContext } from 'react';

export const PomoCyclesContext = React.createContext<ReturnType<
  typeof usePomoCycles
> | null>(null);

export function usePomo() {
  const ctx = useContext(PomoCyclesContext);
  if (!ctx) throw new Error('usePomo must be used inside PomoCyclesProvider');
  return ctx;
}
