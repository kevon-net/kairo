import { useEffect, useState } from 'react';
import { SessionGet } from '@/types/models/session';
import { useSessionActions } from '../actions/sessions';
import { Status } from '@generated/prisma';
import { getRegionalDate } from '@/utilities/formatters/date';
import { PomoCycleGet } from '@/types/models/pomo-cycle';
import { usePomoCycleActions } from '../actions/pomo-cycles';
import { generateUUID } from '@/utilities/generators/id';

type StopReason = 'manual' | 'finished';

export type TimerEvent = SessionGet & { reason?: StopReason };

export const useSessionTimer = () => {
  const { createSession, updateSession, deleteSession } = useSessionActions();
  const { createPomoCycle, updatePomoCycle, deletePomoCycle } =
    usePomoCycleActions();

  const [session, setSession] = useState<Partial<SessionGet> | null>(null);
  const [pomoCycle, setPomoCycle] = useState<Partial<PomoCycleGet> | null>(
    null
  );

  // handler to start new session timer
  const handleStartTimer = (params?: Partial<SessionGet>) => {
    if (session) return;

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

      setSession({ ...newSession, ...params });
    }
  };

  // handler to pause session timer
  const handlePauseTimer = () => {
    if (!session) return;

    const pausedSession = { ...session, status: Status.PAUSED };

    setSession(pausedSession);
    updateSession({ values: pausedSession as SessionGet });
  };

  // handler to resume session timer
  const handleResumeTimer = () => {
    if (!session) return;

    const resumedSession = { ...session, status: Status.ACTIVE };

    setSession(resumedSession);
    updateSession({ values: resumedSession as SessionGet });
  };

  // handler to stop session timer
  const handleStopTimer = (params?: {
    options?: {
      skipping?: boolean;
      cycleReset?: boolean;
    };
  }) => {
    if (session) setSession(null);

    const now = new Date();

    const stoppedSession = {
      ...session,
      status: Status.INACTIVE,
      title: `${session?.title} ${getRegionalDate(now).time}`,
      end: now.toISOString() as any,
    };

    if (
      params?.options?.skipping ||
      (session && (!session.duration || session.duration == session.elapsed))
    ) {
      updateSession({ values: stoppedSession as SessionGet });

      updatePomoCycle({
        values: {
          ...pomoCycle,
          current_session_id: null,
        } as PomoCycleGet,
      });
    } else {
      if (session)
        deleteSession({
          values: { ...session, status: Status.INACTIVE } as SessionGet,
        });

      if (params?.options?.cycleReset && pomoCycle) {
        deletePomoCycle({ values: pomoCycle as PomoCycleGet });
        setPomoCycle(null);
      }
    }
  };

  useEffect(() => {
    if (!session) return;
    if (session.status != Status.ACTIVE) return;

    const intervalLocal = setInterval(() => {
      // update session in local state
      setSession((prev) =>
        prev ? { ...prev, elapsed: (prev.elapsed || 0) + 1 } : prev
      );
    }, 1000);

    const intervalRedux = setInterval(() => {
      // update session in redux state
      setSession((prevSession) => {
        if (!prevSession) return prevSession;

        updateSession({ values: prevSession as SessionGet });

        // also pomo cycle in local state
        setPomoCycle((prevPomoCycle) => {
          if (!prevPomoCycle) return prevPomoCycle;

          // also pomo cycle in redux state
          updatePomoCycle({
            values: {
              ...prevPomoCycle,
              current_session_id: prevSession.id,
            } as PomoCycleGet,
          });

          return prevPomoCycle;
        });

        return prevSession;
      });
    }, 60000);

    return () => {
      clearInterval(intervalLocal);
      clearInterval(intervalRedux);
    };
  }, [session]);

  return {
    session,
    pomoCycle,
    // ensure we never return negative remaining time
    remainingTime: Math.max(
      0,
      (session?.duration || 0) - (session?.elapsed || 0)
    ),
    elapsedTime: session?.elapsed || 0,
    startTimer: handleStartTimer,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
    stopTimer: handleStopTimer,
  };
};
