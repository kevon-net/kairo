import { useState, useCallback, useEffect } from 'react';
import { useSessionTimer } from './timer/session';
import {
  POMO_BREAK_LENGTH,
  POMO_CYCLE_LENGTH,
  POMO_SESSION_LENGTH,
} from '@/data/constants';
import { Status } from '@generated/prisma';

type PomoPhase = 'work' | 'shortBreak' | 'longBreak';

interface UsePomoCyclesOptions {
  workDuration?: number; // minutes
  shortBreakDuration?: number; // minutes
  longBreakDuration?: number; // minutes
  cyclesBeforeLongBreak?: number;
}

export const usePomoCycles = ({
  workDuration = POMO_SESSION_LENGTH * 60,
  shortBreakDuration = POMO_BREAK_LENGTH.SHORT * 60,
  longBreakDuration = POMO_BREAK_LENGTH.LONG * 60,
  cyclesBeforeLongBreak = POMO_CYCLE_LENGTH,
}: UsePomoCyclesOptions = {}) => {
  // inside usePomoCycles
  const {
    session,
    remainingTime,
    elapsedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    pomoCycle,
  } = useSessionTimer();
  const [phase, setPhase] = useState<PomoPhase>('work');
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  const phaseTime = getPhaseTime({ phase });

  // Start current phase
  const startPhase = useCallback(() => {
    startTimer({ pomoDuration: phaseTime });
  }, [
    phaseTime,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    startTimer,
  ]);

  // Skip to next phase manually
  const skipPhase = useCallback(() => {
    stopTimer({ options: { skipping: true } });
    advancePhase();
  }, [stopTimer]);

  // Advance phase logic
  const advancePhase = useCallback(() => {
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
  }, [phase, cyclesBeforeLongBreak]);

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
  }, [stopTimer, pomoCycle]);

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
      return POMO_SESSION_LENGTH * 60;
    case 'shortBreak':
      return POMO_BREAK_LENGTH.SHORT * 60;
    case 'longBreak':
      return POMO_BREAK_LENGTH.LONG * 60;
    default:
      return POMO_SESSION_LENGTH * 60;
  }
};
