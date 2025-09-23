import { useState, useCallback, useEffect } from 'react';
import {
  POMO_BREAK_LENGTH,
  POMO_CYCLE_LENGTH,
  POMO_SESSION_LENGTH,
} from '@/data/constants';
import { SessionType, Status } from '@generated/prisma';
import { SessionGet } from '@/types/models/session';
import { usePomodoroTimer } from './timer/pomodoro';

type PomoPhase = 'work' | 'shortBreak' | 'longBreak';

interface UsePomoCyclesOptions {
  workDuration?: number; // minutes
  shortBreakDuration?: number; // minutes
  longBreakDuration?: number; // minutes
  cyclesBeforeLongBreak?: number;
}

export const usePomoCycles = (params?: { options?: UsePomoCyclesOptions }) => {
  // inside usePomoCycles
  const {
    session,
    remainingTime,
    elapsedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  } = usePomodoroTimer();
  const [phase, setPhase] = useState<PomoPhase>('work');
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  const phaseTime = getPhaseTime({ phase });

  // Start current phase
  const startPhase = useCallback(
    (params?: { values?: Partial<SessionGet> }) => {
      startTimer({
        duration: phaseTime.duration,
        type: phaseTime.type,
        ...params?.values,
      });
    },
    [phaseTime, startTimer]
  );

  // Skip to next phase manually
  const skipPhase = useCallback(() => {
    stopTimer({ options: { skipping: true } });
    advancePhase();
  }, [stopTimer]);

  // Advance phase logic
  const advancePhase = useCallback(() => {
    const cyclesBeforeLongBreak =
      params?.options?.cyclesBeforeLongBreak || POMO_CYCLE_LENGTH;

    if (phase === 'work') {
      setCompletedWorkSessions((prev) => {
        const next = prev + 1;
        if (next % cyclesBeforeLongBreak === 0) {
          setPhase('longBreak');
        } else {
          setPhase('shortBreak');
        }
        return next;
      });
    } else {
      // After any break → always return to work
      setPhase('work');
    }
  }, [phase, params?.options?.cyclesBeforeLongBreak]);

  // Auto-advance when timer ends
  useEffect(() => {
    if (session && remainingTime === 0 && session.status === Status.ACTIVE) {
      setTimeout(() => {
        stopTimer();
        advancePhase();
      }, 1000);
    }
  }, [session, remainingTime, stopTimer, advancePhase]);

  // 🔹 Reset cycle completely
  const resetCycle = useCallback(() => {
    stopTimer({ options: { cycleReset: true } }); // stop any active session

    // reset local state
    setPhase('work');
    setCompletedWorkSessions(0);
  }, [stopTimer]);

  return {
    // Pomodoro state
    phase, // "work" | "shortBreak" | "longBreak"
    phaseTime: phaseTime,
    completedWorkSessions,

    // Timer state passthrough
    session,
    remainingTime,
    elapsedTime,

    // Pomodoro controls
    startPhase,
    skipPhase,
    resetCycle,

    // Timer controls passthrough
    pauseTimer,
    resumeTimer,
    stopTimer, // passthrough
  };
};

const getPhaseTime = (params: { phase: string }) => {
  // switch to get respective phase lengths
  switch (params.phase) {
    case 'work':
      return {
        type: SessionType.POMO_FOCUS,
        duration: POMO_SESSION_LENGTH * 60,
      };
    case 'shortBreak':
      return {
        type: SessionType.POMO_BREAK,
        duration: POMO_BREAK_LENGTH.SHORT * 60,
      };
    case 'longBreak':
      return {
        type: SessionType.POMO_BREAK,
        duration: POMO_BREAK_LENGTH.LONG * 60,
      };
    default:
      return {
        type: SessionType.POMO_FOCUS,
        duration: POMO_SESSION_LENGTH * 60,
      };
  }
};
