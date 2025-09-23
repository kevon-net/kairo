'use client';

import { useEffect, useState } from 'react';
import { usePomoCycleActions } from '../actions/pomo-cycles';
import { useSessionActions } from '../actions/sessions';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { generateUUID } from '@/utilities/generators/id';
import { Status } from '@generated/prisma';
import { getRegionalDate } from '@/utilities/formatters/date';
import { SessionGet } from '@/types/models/session';
import { useSessionTimer } from '@/components/contexts/session-timer';

export const usePomodoroTimer = () => {
  const base = useSessionTimer();
  const { createPomoCycle, updatePomoCycle, deletePomoCycle } =
    usePomoCycleActions();
  const { createSession, updateSession, deleteSession } = useSessionActions();
  const [pomoCycle, setPomoCycle] = useState<Partial<PomoCycleGet> | null>(
    null
  );

  const handleStartTimer = (params?: Partial<SessionGet>) => {
    if (base.session) return;

    const cycleId = generateUUID();
    const newSession = createSession({
      values: { cycle_id: cycleId, ...params },
    });

    if (newSession) {
      if (!pomoCycle) {
        const newPomoCycle = createPomoCycle({
          values: { id: cycleId, current_session_id: newSession.id },
        });
        if (newPomoCycle) setPomoCycle(newPomoCycle);
      } else {
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
      base.startTimer({ ...newSession, ...params });
    }
  };

  const handleStopTimer = (params?: {
    options?: { skipping?: boolean; cycleReset?: boolean };
  }) => {
    if (!base.session) return;
    const now = new Date();

    const stoppedSession = {
      ...base.session,
      status: Status.INACTIVE,
      title: `${base.session?.title} ${getRegionalDate(now).time}`,
      end: now.toISOString() as any,
    };

    const skipping = params?.options?.skipping;
    const finished =
      !base.session?.duration || base.session.duration === base.session.elapsed;

    if (skipping || finished) {
      // let base finalize session
      base.stopTimer();

      updateSession({ values: stoppedSession as SessionGet });
      updatePomoCycle({
        values: { ...pomoCycle, current_session_id: null } as PomoCycleGet,
      });
    } else {
      // prevent base finalization
      base.stopTimer({ options: { noFinalize: true } });

      if (base.session)
        deleteSession({
          values: { ...base.session, status: Status.INACTIVE } as SessionGet,
        });

      if (params?.options?.cycleReset && pomoCycle) {
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
    remainingTime: Math.max(
      0,
      (base.session?.duration || 0) - (base.session?.elapsed || 0)
    ),
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
  };
};
