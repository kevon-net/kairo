import { TimerDirection } from '@/enums/date-time';
import { Timer } from '@/types/date-time';
import { getTimeElapsed, getTimeRemaining } from '@/utilities/helpers/time';
import { useEffect, useState } from 'react';

/**
 * sample arguments:
 * - new Date(2025, 12, 31, 23, 59, 59)
 * - new Date('2025-12-31T23:59:59')
 */
export default function useTimer(params: {
  targetDate: Date;
  direction?: TimerDirection.DOWN;
  active?: boolean;
}) {
  // Decide which function to use based on direction
  const getTime: (targetDate: Date) => Timer | null =
    params.direction === TimerDirection.DOWN
      ? getTimeRemaining
      : getTimeElapsed;

  const [time, setTime] = useState(() => getTime(params.targetDate));

  const [isActive, setActive] = useState(params.active ?? true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setTime(getTime(params.targetDate));
      }
    }, 1000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [params.targetDate, getTime, isActive]);

  return { time, isActive, setActive };
}
