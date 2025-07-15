import { TIME_FORMAT } from '@/data/constants';
import { HourSystem } from '@/enums/date';
import { getRegionalDate } from '@/utilities/formatters/date';

const hour = 60 * 60 * 1000;
const day = 24 * hour;
// const week = 7 * day;

export const getTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + day);

  // Ensure the time is set to 09:00 AM UTC, not local time
  return new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      9,
      0,
      0,
      0
    )
  );
};

export const getNextWeek = (params?: { exactWeekAhead?: boolean }) => {
  const now = new Date();

  if (params?.exactWeekAhead) {
    // Ensure the date is exactly 7 days ahead, preserving UTC consistency
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7,
        9,
        0,
        0,
        0
      )
    );
  }

  // Get the current UTC day of the week (0 = Sunday, ..., 6 = Saturday)
  const currentDay = now.getUTCDay();
  const daysUntilNextMonday = (8 - currentDay) % 7 || 7; // Days until next Monday

  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilNextMonday);
  nextMonday.setUTCHours(9, 0, 0, 0);

  return nextMonday;
};

export const getRoundedFutureTime = (props?: { hoursToAdd?: number }) => {
  const now = new Date(); // Current date and time in UTC

  // Add specified hours or default to 2 hours
  now.setUTCHours(now.getUTCHours() + (props?.hoursToAdd || 2));

  // Round up to the next whole UTC hour
  now.setUTCMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
  now.setUTCHours(now.getUTCHours() + 1); // Move to the next whole hour

  return now;
};

export const checkDate = (props: {
  date: Date;
  checkFor: 'today' | 'tomorrow';
}) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize current date to midnight

  const providedDate = new Date(props.date);
  providedDate.setHours(0, 0, 0, 0); // Normalize provided date to midnight

  switch (props.checkFor) {
    case 'today':
      if (now.getTime() === providedDate.getTime()) return 'today';
      break;

    case 'tomorrow':
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1); // Move to tomorrow
      if (tomorrow.getTime() === providedDate.getTime()) return 'tomorrow';
      break;
  }

  return '';
};

export const getNextWeekdays = (
  currentDate: Date,
  includePastWeekdays = false
): Date[] => {
  const todayIndex = currentDate.getUTCDay() || 7; // Convert Sunday (0) to 7 (ISO)
  const result: Date[] = [];

  if (includePastWeekdays) {
    // Include all weekdays from the current week (Monday to Friday)
    for (let i = 1; i <= 5; i++) {
      const pastDate = new Date(currentDate); // Clone date
      pastDate.setUTCDate(currentDate.getUTCDate() - (todayIndex - i));
      result.push(pastDate);
    }
    return result;
  }

  if (todayIndex >= 1 && todayIndex <= 5) {
    // If today is a weekday, get today + remaining weekdays
    for (let i = 0; i < 5 - todayIndex + 1; i++) {
      const nextDate = new Date(currentDate); // Clone date
      nextDate.setUTCDate(currentDate.getUTCDate() + i);
      result.push(nextDate);
    }
  } else {
    // If today is Saturday (6) or Sunday (7), move to next Monday
    const daysUntilNextMonday = 8 - todayIndex;
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(currentDate); // Clone date
      nextDate.setUTCDate(currentDate.getUTCDate() + daysUntilNextMonday + i);
      result.push(nextDate);
    }
  }

  return result;
};

export const sortWeekdaysInOrder = (weekdays: string[]): string[] => {
  const calendarOrder: string[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  // Convert input to uppercase and extract the first two characters
  const normalizedWeekdays = weekdays.map((day) =>
    day.toUpperCase().slice(0, 2)
  );

  // Validate input
  if (!normalizedWeekdays.every((day) => calendarOrder.includes(day))) {
    throw new Error('One or more invalid weekday names were provided.');
  }

  // Sort the weekdays in calendar order
  return normalizedWeekdays.sort(
    (a, b) => calendarOrder.indexOf(a) - calendarOrder.indexOf(b)
  );
};

export const getDueButtonLabel = (params: { date: Date }) => {
  const isToday = checkDate({ date: params.date, checkFor: 'today' });
  const isTomorrow = checkDate({ date: params.date, checkFor: 'tomorrow' });
  let label;

  if (isToday) {
    label = `Today`;
  } else if (isTomorrow) {
    label = `Tomorrow`;
  } else {
    label = `${getRegionalDate(params.date, { locale: TIME_FORMAT.LOCALE, format: 'short' }).date}`;
  }

  return label;
};

export const getReminderButtonLabel = (params: { date: Date }) => {
  const isToday = checkDate({ date: params.date, checkFor: 'today' });
  const isTomorrow = checkDate({ date: params.date, checkFor: 'tomorrow' });
  let label;

  const reminderTime = getRegionalDate(params.date, {
    hourSystem: HourSystem.TWENTY_FOUR,
  }).time;

  if (isToday) {
    label = `Today, ${reminderTime}`;
  } else if (isTomorrow) {
    label = `Tomorrow, ${reminderTime}`;
  } else {
    label = `${reminderTime}, ${getRegionalDate(params.date, { locale: TIME_FORMAT.LOCALE, format: 'short' }).date}`;
  }

  return label;
};
