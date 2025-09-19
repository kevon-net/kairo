import { useEffect, useState } from 'react';
import { SessionGet } from '@/types/models/session';
import { useSessionActions } from '../actions/sessions';
import { Status } from '@generated/prisma';
import { getRegionalDate } from '@/utilities/formatters/date';

type StopReason = 'manual' | 'finished';

export type TimerEvent = SessionGet & { reason?: StopReason };

export const useSessionTimer = () => {
  const { createSession, updateSession, deleteSession } = useSessionActions();

  const [session, setSession] = useState<Partial<SessionGet> | null>(null);

  // handler to start new session timer
  const handleStartTimer = (params?: { pomoDuration?: number }) => {
    if (session) return;

    const newSession = createSession();

    if (newSession)
      setSession({
        ...newSession,
        duration: !params?.pomoDuration ? null : params.pomoDuration * 60,
      });
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
  const handleStopTimer = () => {
    if (!session) return;

    setSession(null);

    const now = new Date();

    const stoppedSession = {
      ...session,
      status: Status.INACTIVE,
      title: `${session.title} ${getRegionalDate(now).time}`,
      end: now.toISOString() as any,
    };

    if (!session.duration || session.duration == session.elapsed) {
      updateSession({ values: stoppedSession as SessionGet });
    } else {
      deleteSession({ values: session as SessionGet });
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
      setSession((prev) => {
        if (!prev) return prev;
        updateSession({ values: prev as SessionGet });
        return prev;
      });
    }, 60000);

    return () => {
      clearInterval(intervalLocal);
      clearInterval(intervalRedux);
    };
  }, [session]);

  return {
    session,
    // ensure we never return negative remaining time
    remainingTime: Math.max(
      0,
      (session?.duration || 0) - (session?.elapsed || 0)
    ),
    elapsedTime: session?.elapsed,
    startTimer: handleStartTimer,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
    stopTimer: handleStopTimer,
  };
};
