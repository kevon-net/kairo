import { usePomo } from '@/components/contexts/pomo-cycles';
import { TaskGet } from '@/types/models/task';
import { secToHourMinSec } from '@/utilities/formatters/number';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from './redux';

export const useTotalElapsedTask = ({ task }: { task: TaskGet }) => {
  const sessions = useAppSelector((state) => state.sessions.value);
  const { session, elapsedTime } = usePomo(); // <- make sure your usePomo returns session.elapsed (local ticking)

  const [elapsed, setElapsed] = useState(0);

  // total completed sessions for this task
  const completedElapsed = useMemo(() => {
    return (
      sessions
        ?.filter((s) => s.task_id === task.id && s.id !== session?.id) // exclude the active one
        .reduce((acc, s) => acc + (s.elapsed || 0), 0) ?? 0
    );
  }, [sessions, task.id, session?.id]);

  useEffect(() => {
    const isActive = session?.task_id === task.id;

    if (!isActive) {
      setElapsed(completedElapsed);
      return;
    }

    // If active, combine past + live ticking
    setElapsed(completedElapsed + (elapsedTime || 0));
  }, [session, elapsedTime, completedElapsed, task.id]);

  const hourMinSec = secToHourMinSec(elapsed);

  return { elapsedTime: elapsed, hourMinSec };
};
