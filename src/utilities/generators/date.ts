/**
 * Generates a random Date object between two given dates.
 * If no dates are provided, defaults to a date within the last 10 years.
 * @param from The start date (optional)
 * @param to The end date (optional)
 * @returns A random Date object
 */
export function getRandomDate(from?: Date, to?: Date): Date {
  const now = new Date();

  // Default range: within the past 10 years
  const defaultStart = new Date(now);
  defaultStart.setFullYear(now.getFullYear() - 10);

  const start = from ?? defaultStart;
  const end = to ?? now;

  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) {
    throw new Error('Start date must be before end date.');
  }

  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}
