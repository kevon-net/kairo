export interface MinSec {
  minutes: string;
  seconds: string;
}

export const millToMinSec = (milliseconds: number): MinSec | null => {
  try {
    if (milliseconds < 0)
      throw new Error('Milliseconds value cannot be negative.');

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString();
    const seconds = (totalSeconds % 60).toString();

    return { minutes, seconds };
  } catch (error) {
    console.error('x-> Time convertion failure:', error);
    return null;
  }
};

// helper that takes in seconds and returns minutes and seconds
export const secToMinSec = (seconds: number): MinSec | null => {
  try {
    if (seconds < 0) throw new Error('Seconds value cannot be negative.');

    const minutes = Math.floor(seconds / 60).toString();
    const remainingSeconds = (seconds % 60).toString();

    return { minutes, seconds: remainingSeconds };
  } catch (error) {
    console.error('x-> Time convertion failure:', error);
    return null;
  }
};

// helper that takes in seconds and returns hours, minutes, and seconds
export const secToHourMinSec = (
  seconds: number
): (MinSec & { hours: string }) | null => {
  try {
    if (seconds < 0) throw new Error('Seconds value cannot be negative.');

    const hours = Math.floor(seconds / 3600).toString();
    const minutes = Math.floor((seconds % 3600) / 60).toString();
    const remainingSeconds = (seconds % 60).toString();

    return { hours, minutes, seconds: remainingSeconds };
  } catch (error) {
    console.error('x-> Time convertion failure:', error);
    return null;
  }
};

export const prependZeros = (value: number, length: number): string => {
  const paddedStr = String(value).padStart(length, '0');
  return paddedStr;
};

export const formatNumber = (value: number, decimals: number = 1): string => {
  const lookup = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ];

  // Handle negative numbers
  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Find the appropriate range
  const item = lookup.find((item) => absoluteValue >= item.value);

  if (item) {
    // Format with specified decimal places and symbol
    const formattedValue = (absoluteValue / item.value).toFixed(decimals);
    // Remove trailing zeros and decimal point if not needed
    const cleanValue = parseFloat(formattedValue).toString();
    return sign + cleanValue + item.symbol;
  }

  // Return the original number if it's smaller than 1000
  return sign + absoluteValue.toString();
};
