import { useCallback, useEffect, useMemo, useState } from 'react';
import { Status } from '@generated/prisma';
import { POMO_BREAK_LENGTH, POMO_SESSION_LENGTH } from '@/data/constants';

export type PomodoroData = {
  status: Status;
  remainingSeconds: number;
  totalDurationSeconds: number;
  focusDuration: number;
  end: string | null;
};

type StopReason = 'manual' | 'finished';

export type PomodoroEvent = {
  status: Status; // the new/next status for this event
  remainingSeconds: number;
  totalDurationSeconds: number;
  focusDuration: number; // derived
  end?: string; // only on stop
  reason?: StopReason;
};

export const usePomodoro = ({
  durationMinutes,
  onStart,
  onPause,
  onStop,
}: {
  durationMinutes: number;
  onStart?: (e: PomodoroEvent) => void;
  onPause?: (e: PomodoroEvent) => void;
  onStop?: (e: PomodoroEvent) => void;
}) => {
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
      setTimeout(() => {
        stopTimer('finished');
      }, 1000);
    }
  }, [remainingSeconds, state]);

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
    onStart?.({ ...snap, reason: 'finished' });
  }, [makeSnapshot, onStart]);

  const pauseTimer = useCallback(() => {
    const snap = makeSnapshot(Status.PAUSED);
    setState(Status.PAUSED);
    onPause?.({ ...snap, reason: 'finished' });
  }, [makeSnapshot, onPause]);

  const stopTimer = useCallback(
    (reason: StopReason = 'manual') => {
      const snap = makeSnapshot(Status.INACTIVE, { withEnd: true });
      setState(Status.INACTIVE);
      setRemainingSeconds(totalDurationSeconds);
      onStop?.({ ...snap, reason });
    },
    [makeSnapshot, onStop, totalDurationSeconds]
  );

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return { minutes, seconds, state, startTimer, pauseTimer, stopTimer };
};

type Mode = 'work' | 'shortBreak' | 'longBreak';

export const usePomodoroCycle = ({
  workMinutes = POMO_SESSION_LENGTH,
  shortBreakMinutes = POMO_BREAK_LENGTH,
  longBreakMinutes = POMO_BREAK_LENGTH * 3,
  longBreakEvery = 4,
  onWorkStart,
  onWorkStop,
  onBreakStart,
  onBreakStop,
}: {
  workMinutes?: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakEvery?: number; // default = 4
  onWorkStart?: (e: PomodoroEvent) => void;
  onWorkStop?: (e: PomodoroEvent) => void;
  onBreakStart?: (e: PomodoroEvent) => void;
  onBreakStop?: (e: PomodoroEvent) => void;
}) => {
  const [mode, setMode] = useState<Mode>('work');
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  const { minutes, seconds, state, startTimer, pauseTimer, stopTimer } =
    usePomodoro({
      durationMinutes:
        mode === 'work'
          ? workMinutes
          : mode === 'shortBreak'
            ? shortBreakMinutes
            : longBreakMinutes,
      onStart: (e) => {
        if (mode === 'work') onWorkStart?.(e);
        else onBreakStart?.(e);
      },
      onStop: (e) => {
        if (mode === 'work') {
          onWorkStop?.(e);

          if (e.reason === 'finished') {
            setCompletedWorkSessions((c) => c + 1);

            if ((completedWorkSessions + 1) % longBreakEvery === 0) {
              setMode('longBreak');
              setTimeout(() => startTimer(), 1000);
            } else {
              setMode('shortBreak');
              setTimeout(() => startTimer(), 1000);
            }
          } else {
            // manual stop → reset cycle to work
            setMode('work');
          }
        } else if (mode === 'shortBreak' || mode === 'longBreak') {
          onBreakStop?.(e);

          if (e.reason === 'finished') {
            setMode('work');

            if (mode === 'longBreak') {
              setCompletedWorkSessions(0); // reset after long break
            }

            setTimeout(() => startTimer(), 1000);
          } else {
            setMode('work');
          }
        }
      },
      onPause: () =>
        // e
        {
          // optional: you can distinguish by mode here too
        },
    });

  return {
    minutes,
    seconds,
    state,
    mode,
    completedWorkSessions,
    startTimer,
    pauseTimer,
    stopTimer,
  };
};
