import { Timer } from '@/types/date-time';

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

export const getTimeElapsed = (targetDate: Date | string): Timer | null => {
  const now = new Date();

  if (typeof targetDate == 'string') {
    targetDate = new Date(targetDate);
  }

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

type TimeUnit = {
  value: number;
  unit:
    | 'month'
    | 'months'
    | 'day'
    | 'days'
    | 'hour'
    | 'hours'
    | 'minute'
    | 'minutes'
    | 'second'
    | 'seconds';
};

export const getAppropriateDuration = (
  targetDate: Date | string
): TimeUnit | null => {
  const elapsed = getTimeElapsed(targetDate);

  if (!elapsed) {
    return null;
  }

  if (elapsed.months > 0) {
    return {
      value: elapsed.months,
      unit: `month${elapsed.months > 1 ? 's' : ''}`,
    };
  }

  if (elapsed.days > 0) {
    return {
      value: elapsed.days,
      unit: `day${elapsed.days > 1 ? 's' : ''}`,
    };
  }

  if (elapsed.hours > 0) {
    return {
      value: elapsed.hours,
      unit: `hour${elapsed.hours > 1 ? 's' : ''}`,
    };
  }

  if (elapsed.minutes > 0) {
    return {
      value: elapsed.minutes,
      unit: `minute${elapsed.minutes > 1 ? 's' : ''}`,
    };
  }

  return {
    value: elapsed.seconds,
    unit: `second${elapsed.seconds > 1 ? 's' : ''}`,
  };
};

export const isOverdue = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);

  // Normalize today to remove time components (set to midnight UTC)
  const today = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  );

  // Normalize the input date (set to midnight UTC)
  const normalizedDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  return normalizedDate < today;
};

export const isToday = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);

  // Normalize both dates to local midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  date.setHours(0, 0, 0, 0); // Normalize input date

  return date.getTime() === today.getTime();
};

export const isTomorrow = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);

  // Normalize both dates to local time midnight
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1); // Move to tomorrow

  date.setHours(0, 0, 0, 0); // Normalize input date

  return date.getTime() === tomorrow.getTime();
};

export const groupDatesByWeek = (dates: Date[]): { min: Date; max: Date }[] => {
  // Sort the dates in ascending order
  dates.sort((a, b) => a.getTime() - b.getTime());

  const dateRanges: { min: Date; max: Date }[] = [];
  const seenRanges = new Set<string>(); // To avoid duplicate ranges

  // Function to get the Monday of the week for a given date (local time)
  const getMonday = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // Local day of the week (Sunday = 0, Monday = 1)
    const diff = day === 0 ? -6 : 1 - day; // Move back to Monday
    d.setDate(d.getDate() + diff);
    return d;
  };

  // Function to get the Sunday of the week for a given date (local time)
  const getSunday = (date: Date): Date => {
    const monday = getMonday(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  };

  // Iterate over the sorted dates and generate the corresponding week range
  for (const date of dates) {
    const monday = getMonday(date);
    const sunday = getSunday(date);

    // Use JSON.stringify to compare ranges, as Date objects cannot be directly compared
    const rangeKey = `${monday.toISOString()}-${sunday.toISOString()}`;

    if (!seenRanges.has(rangeKey)) {
      dateRanges.push({ min: monday, max: sunday });
      seenRanges.add(rangeKey);
    }
  }

  return dateRanges;
};

export const isDateInRange = (
  date: Date,
  range: { min: Date; max: Date }
): boolean => {
  return date >= range.min && date <= range.max;
};

export const isWithinNext7Days = (date: Date | null): boolean => {
  if (!date) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to local midnight

  const end = new Date(now);
  end.setDate(now.getDate() + 7); // Move to 7 days later

  return date >= now && date <= end;
};

export const deduplicateDates = (dates: (Date | string)[]): Date[] => {
  // Create a map to store unique dates by their UTC date string
  const uniqueDatesMap = new Map<string, Date>();

  // Process each date
  dates.forEach((dateInput) => {
    // Convert to Date object if string
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    // Create a key in format YYYY-MM-DD using UTC values
    const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

    // Only add to map if this day doesn't exist yet
    if (!uniqueDatesMap.has(dateKey)) {
      uniqueDatesMap.set(dateKey, new Date(date));
    }
  });

  // Convert map values to array
  return Array.from(uniqueDatesMap.values());
};

export const areSameDay = (
  dateA: Date | string,
  dateB: Date | string
): boolean => {
  // Convert to Date objects if strings
  const dateObjA = new Date(dateA);
  const dateObjB = new Date(dateB);

  // Ensure both dates are valid before proceeding
  if (isNaN(dateObjA.getTime()) || isNaN(dateObjB.getTime())) {
    return false; // or throw an error if needed
  }

  // Compare year, month, and day using UTC values
  return (
    dateObjA.getUTCFullYear() === dateObjB.getUTCFullYear() &&
    dateObjA.getUTCMonth() === dateObjB.getUTCMonth() &&
    dateObjA.getUTCDate() === dateObjB.getUTCDate()
  );
};

// helper that returns 'morning', 'afternoon', 'evening', 'night' based on the time of day
export const getTimeOfDay = ():
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night' => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 18) return 'afternoon';
  if (hours >= 18 && hours < 21) return 'evening';
  return 'night';
};
