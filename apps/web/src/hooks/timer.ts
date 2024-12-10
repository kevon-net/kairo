import { TimerDirection } from '@repo/enums';
import { Timer } from '@repo/types';
import { getTimeElapsed, getTimeRemaining } from '@repo/utils/helpers';
import { useEffect, useState } from 'react';

/**
 * sample arguments:
 * - new Date(2025, 12, 31, 23, 59, 59)
 * - new Date('2025-12-31T23:59:59')
 */
export default function useTimer(
  targetDate: Date,
  direction?: TimerDirection.DOWN,
  active: boolean = true
) {
  // Decide which function to use based on direction
  const getTime: (targetDate: Date) => Timer | null =
    direction === TimerDirection.DOWN ? getTimeRemaining : getTimeElapsed;

  const [time, setTime] = useState(() => getTime(targetDate));

  const [isActive, setActive] = useState(active);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setTime(getTime(targetDate));
      }
    }, 1000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [targetDate, getTime, isActive]);

  return { time, setTime, isActive, setActive };
}
