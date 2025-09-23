'use client';

import { useEffect, useState } from 'react';
import { SessionGet } from '@/types/models/session';
import { useSessionActions } from '../actions/sessions';
import { SessionType, Status } from '@generated/prisma';
import { getRegionalDate } from '@/utilities/formatters/date';

type StopReason = 'manual' | 'finished';

export type TimerEvent = SessionGet & { reason?: StopReason };

export const useSessionTimer = () => {
  const { createSession, updateSession } = useSessionActions();
  const [session, setSession] = useState<Partial<SessionGet> | null>(null);

  const handleStartTimer = (params?: Partial<SessionGet>) => {
    if (session) return;
    const newSession = createSession({ values: { ...params } });
    if (newSession) {
      setSession({
        ...newSession,
        status: Status.ACTIVE,
        type: SessionType.STOPWATCH,
        ...params,
      });
    }
  };

  const handleStopTimer = (params?: { options?: { noFinalize?: boolean } }) => {
    if (!session) return;

    const now = new Date();

    if (!params?.options?.noFinalize) {
      const stoppedSession = {
        ...session,
        status: Status.INACTIVE,
        title: `${session.title ?? ''} ${getRegionalDate(now).time}`,
        end: now.toISOString() as any,
      };

      // let caller handle delete/skip logic
      updateSession({
        values: stoppedSession as SessionGet,
      });
    }

    setSession(null);
  };

  const handlePauseTimer = () => {
    if (!session) return;
    const pausedSession = { ...session, status: Status.PAUSED };
    setSession(pausedSession);
    updateSession({ values: pausedSession as SessionGet });
  };

  const handleResumeTimer = () => {
    if (!session) return;
    const resumedSession = { ...session, status: Status.ACTIVE };
    setSession(resumedSession);
    updateSession({ values: resumedSession as SessionGet });
  };

  useEffect(() => {
    if (!session || session.status !== Status.ACTIVE) return;

    let seconds = 0;

    const intervalLocal = setInterval(() => {
      setSession((prev) => {
        if (!prev) return prev;

        const updated = { ...prev, elapsed: (prev.elapsed || 0) + 1 };

        seconds++;

        // every 60s, push to redux
        if (seconds >= 60) {
          updateSession({ values: updated as SessionGet });
          seconds = 0;
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(intervalLocal);
  }, [session]);

  return {
    session,
    elapsedTime: session?.elapsed || 0,
    startTimer: handleStartTimer,
    stopTimer: handleStopTimer,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
  };
};
