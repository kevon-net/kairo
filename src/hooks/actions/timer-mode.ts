import { useAppDispatch, useAppSelector } from '../redux';
import { setCookieClient } from '@/utilities/helpers/cookie-client';
import { COOKIE_NAME, WEEK } from '@/data/constants';
import {
  TimerMode,
  updateTimerMode,
} from '@/libraries/redux/slices/timer-mode';

export const useTimerMode = () => {
  const timerMode = useAppSelector((state) => state.timerMode.value);
  const dispatch = useAppDispatch();

  const handleTimerModeChange = () => {
    if (timerMode == null) return;

    const newValue: TimerMode = {
      mode: timerMode.mode == 'timer' ? 'stopwatch' : 'timer',
    };

    dispatch(updateTimerMode(newValue));

    setCookieClient(COOKIE_NAME.TIMER_MODE, newValue, {
      expiryInSeconds: WEEK,
    });
  };

  return {
    timerMode,
    toogleTimerMode: handleTimerModeChange,
  };
};
