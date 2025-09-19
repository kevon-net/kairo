import { useState, useCallback, useEffect } from 'react';
import { useSessionTimer } from './timer/session';
import {
  POMO_BREAK_LENGTH,
  POMO_CYCLE_LENGTH,
  POMO_SESSION_LENGTH,
} from '@/data/constants';

type PomoPhase = 'work' | 'shortBreak' | 'longBreak';

interface UsePomoCyclesOptions {
  workDuration?: number; // minutes
  shortBreakDuration?: number; // minutes
  longBreakDuration?: number; // minutes
  cyclesBeforeLongBreak?: number;
}

export const usePomoCycles = ({
  workDuration = POMO_SESSION_LENGTH,
  shortBreakDuration = POMO_BREAK_LENGTH.SHORT,
  longBreakDuration = POMO_BREAK_LENGTH.LONG,
  cyclesBeforeLongBreak = POMO_CYCLE_LENGTH,
}: UsePomoCyclesOptions = {}) => {
  const {
    session,
    remainingTime,
    elapsedTime,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  } = useSessionTimer();

  const [phase, setPhase] = useState<PomoPhase>('work');
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  // Start current phase
  const startPhase = useCallback(() => {
    if (phase === 'work') {
      startTimer({ pomoDuration: workDuration });
    } else if (phase === 'shortBreak') {
      startTimer({ pomoDuration: shortBreakDuration });
    } else if (phase === 'longBreak') {
      startTimer({ pomoDuration: longBreakDuration });
    }
  }, [phase, workDuration, shortBreakDuration, longBreakDuration, startTimer]);

  // Skip to next phase manually
  const skipPhase = useCallback(() => {
    stopTimer();
    advancePhase();
  }, [stopTimer]);

  // Advance phase logic
  const advancePhase = useCallback(() => {
    if (phase === 'work') {
      setCompletedWorkSessions((prev) => prev + 1);

      // After 4 work sessions → long break
      if ((completedWorkSessions + 1) % cyclesBeforeLongBreak === 0) {
        setPhase('longBreak');
      } else {
        setPhase('shortBreak');
      }
    } else {
      // After any break → always return to work
      setPhase('work');
    }
  }, [phase, completedWorkSessions, cyclesBeforeLongBreak]);

  // Auto-advance when timer ends
  useEffect(() => {
    if (!session) return;
    if (remainingTime > 0) return;

    // Timer finished
    stopTimer();
    advancePhase();
  }, [session, remainingTime, stopTimer, advancePhase]);

  // 🔹 Reset cycle completely
  const resetCycle = useCallback(() => {
    stopTimer(); // stop any active session
    setPhase('work');
    setCompletedWorkSessions(0);
  }, [stopTimer]);

  return {
    // Pomodoro state
    phase, // "work" | "shortBreak" | "longBreak"
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
