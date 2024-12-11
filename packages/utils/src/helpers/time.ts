import { Timer } from '@repo/types';

export const getTimeRemaining = (targetDate: Date): Timer | null => {
  const now = new Date();

  // Check if the target date is in the future
  if (targetDate.getTime() <= now.getTime()) {
    return null;
    // or handle as you see fit, e.g. return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let totalSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
  totalSeconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= 24 * 60 * 60;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
};

export const getTimeElapsed = (targetDate: Date): Timer | null => {
  const now = new Date();

  // Check if the target date is in the past
  if (targetDate.getTime() > now.getTime()) {
    return null; // The event hasn't happened yet, handle accordingly
  }

  let totalSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
  totalSeconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= 24 * 60 * 60;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
};
