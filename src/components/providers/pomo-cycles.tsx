'use client';

import { usePomoCycles } from '@/hooks/pomo';
import { PomoCyclesContext } from '../contexts/pomo-cycles';

export default function PomoCyclesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cycles = usePomoCycles();
  return (
    <PomoCyclesContext.Provider value={cycles}>
      {children}
    </PomoCyclesContext.Provider>
  );
}
