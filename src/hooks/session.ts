import { useCallback, useEffect, useMemo, useState } from 'react';
import { Status } from '@generated/prisma';
import { POMO_SESSION_LENGTH } from '@/data/constants';

export type PomodoroData = {
  status: Status;
  remainingSeconds: number;
  totalDurationSeconds: number;
  focusDuration: number;
  end: string | null;
};

export type PomodoroEvent = {
  status: Status; // the new/next status for this event
  remainingSeconds: number;
  totalDurationSeconds: number;
  focusDuration: number; // derived
  end?: string; // only on stop
};

export default function usePomodoro({
  durationMinutes,
  onStart,
  onPause,
  onStop,
}: {
  durationMinutes: number;
  onStart?: (e: PomodoroEvent) => void;
  onPause?: (e: PomodoroEvent) => void;
  onStop?: (e: PomodoroEvent) => void;
}) {
  const totalDurationSeconds = useMemo(
    () => (durationMinutes > 0 ? durationMinutes : POMO_SESSION_LENGTH) * 60,
    [durationMinutes]
  );

  const [remainingSeconds, setRemainingSeconds] =
    useState(totalDurationSeconds);
  const [state, setState] = useState<Status>(Status.INACTIVE);

  // If duration changes while inactive, reset the countdown to match
  useEffect(() => {
    if (state === Status.INACTIVE) setRemainingSeconds(totalDurationSeconds);
  }, [totalDurationSeconds, state]);

  useEffect(() => {
    if (state !== Status.ACTIVE) return;
    const id = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state !== Status.ACTIVE) return;

    // stop if no remaining time
    if (remainingSeconds == 0) {
      stopTimer();
      return;
    }
  }, [remainingSeconds]);

  const makeSnapshot = useCallback(
    (status: Status, opts?: { withEnd?: boolean }): PomodoroEvent => ({
      status,
      remainingSeconds,
      totalDurationSeconds,
      focusDuration: totalDurationSeconds - remainingSeconds,
      ...(opts?.withEnd ? { end: new Date().toISOString() } : {}),
    }),
    [remainingSeconds, totalDurationSeconds]
  );

  const startTimer = useCallback(() => {
    const snap = makeSnapshot(Status.ACTIVE);
    setState(Status.ACTIVE);
    onStart?.(snap);
  }, [makeSnapshot, onStart]);

  const pauseTimer = useCallback(() => {
    const snap = makeSnapshot(Status.PAUSED);
    setState(Status.PAUSED);
    onPause?.(snap);
  }, [makeSnapshot, onPause]);

  const stopTimer = useCallback(() => {
    const snap = makeSnapshot(Status.INACTIVE, { withEnd: true });
    setState(Status.INACTIVE);
    setRemainingSeconds(totalDurationSeconds);
    onStop?.(snap);
  }, [makeSnapshot, onStop, totalDurationSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return { minutes, seconds, state, startTimer, pauseTimer, stopTimer };
}
