import { HourSystem } from '@repo/enums';
import { FormatOptions } from '@repo/types';

export const getRegionalDate = (
  date: Date,
  options: FormatOptions = {
    locale: 'en-GB',
    format: 'short',
  }
): { date: string; time: string } => {
  // Handle both string and Date inputs
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error('---> utility error - (invalid date)');
  }

  const formatDate = () => {
    let formatOptions: Intl.DateTimeFormatOptions;

    switch (options?.format) {
      case 'short':
        formatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        break;

      case 'long':
        formatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        break;

      case 'full':
        formatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        };

        break;

      default:
        formatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        };

        break;
    }

    return new Intl.DateTimeFormat(options.locale, {
      ...formatOptions,
    }).format(dateObj);
  };

  const formatTime = () => {
    return new Intl.DateTimeFormat(options.locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: options.hourSystem != HourSystem.TWENTY_FOUR,
      timeZone: options.timezone,
    }).format(dateObj);
  };

  return { date: formatDate(), time: formatTime() };
};

export const isFutureDate = (date: Date): boolean => {
  return date.getTime() > new Date().getTime();
};

export const isPastDate = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};
