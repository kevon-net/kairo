'use client';

import { useEffect, useState } from 'react';
import { usePomoCycleActions } from '../actions/pomo-cycles';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { generateUUID } from '@/utilities/generators/id';
import { Status } from '@generated/prisma';
import { SessionGet } from '@/types/models/session';
import { useSessionTimer } from '@/components/contexts/session-timer';

export const usePomodoroTimer = () => {
  const base = useSessionTimer();
  const { createPomoCycle, updatePomoCycle, deletePomoCycle } =
    usePomoCycleActions();
  const [pomoCycle, setPomoCycle] = useState<Partial<PomoCycleGet> | null>(
    null
  );

  const handleStartTimer = (params?: Partial<SessionGet>) => {
    if (base.session) return;

    const cycleId = pomoCycle?.id ?? generateUUID();

    // let base handle session creation
    const newSession = base.startTimer({
      cycle_id: cycleId,
      ...params,
    });

    if (!newSession) return;

    if (!pomoCycle) {
      // create new cycle if none exists
      const newPomoCycle = createPomoCycle({
        values: { id: cycleId, current_session_id: newSession.id },
      });
      if (newPomoCycle) setPomoCycle(newPomoCycle);
    } else {
      // update existing cycle
      setPomoCycle((prev) =>
        prev ? { ...prev, current_session_id: newSession.id } : prev
      );
      updatePomoCycle({
        values: {
          ...pomoCycle,
          current_session_id: newSession.id,
        } as PomoCycleGet,
      });
    }
  };

  const handleStopTimer = (params?: {
    options?: { skipping?: boolean; cycleReset?: boolean };
  }) => {
    if (!base.session) return;

    const skipping = params?.options?.skipping;
    const cycleReset = params?.options?.cycleReset;

    const finishedOrCountup =
      !base.session?.duration || base.session.duration === base.session.elapsed;

    // Delegate session finalization to base
    if (cycleReset) {
      base.stopTimer({ options: { cycleReset: true } });
    } else if (skipping || finishedOrCountup) {
      base.stopTimer({ options: { skipping } });
    } else {
      base.stopTimer({ options: { noFinalize: true } });
    }

    // Update PomoCycle after session stops
    if (pomoCycle) {
      if (cycleReset || skipping || finishedOrCountup) {
        // session finished → detach from cycle
        updatePomoCycle({
          values: { ...pomoCycle, current_session_id: null } as PomoCycleGet,
        });
      }
      if (cycleReset) {
        // completely remove cycle
        deletePomoCycle({ values: pomoCycle as PomoCycleGet });
        setPomoCycle(null);
      }
    }
  };

  useEffect(() => {
    if (!base.session || base.session.status !== Status.ACTIVE) return;

    const intervalRedux = setInterval(() => {
      if (base.session && pomoCycle) {
        updatePomoCycle({
          values: {
            ...pomoCycle,
            current_session_id: base.session.id,
          } as PomoCycleGet,
        });
      }
    }, 60000);

    return () => clearInterval(intervalRedux);
  }, [base.session, pomoCycle]);

  return {
    ...base,
    pomoCycle,
    setPomoCycle,
    remainingTime: Math.max(
      0,
      (base.session?.duration || 0) - (base.session?.elapsed || 0)
    ),
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
  };
};
