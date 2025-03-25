export interface MinSec {
  minutes: string;
  seconds: string;
}

export const millToMinSec = (milliseconds: number): MinSec | undefined => {
  try {
    if (milliseconds < 0) {
      throw new Error('Milliseconds value cannot be negative.');
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString();
    const seconds = (totalSeconds % 60).toString();

    return { minutes, seconds };
  } catch (error) {
    console.error('x-> Time convertion failure:', error);
  }
};

export const prependZeros = (value: number, length: number): string => {
  /**
   * Convert value to string
   * Prepend zeros until the length of the string is = 'length'
   */
  const paddedStr = String(value).padStart(length, '0');

  return paddedStr;
};

/**
 * Formats a number into a human-readable string with appropriate unit suffixes
 * (k for thousands, M for millions, B for billions)
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted string (e.g., "12.3k", "1.5M", "2B")
 *
 * @example
 * formatNumber(1234)      // "1.2k"
 * formatNumber(1234567)   // "1.2M"
 * formatNumber(1234, 0)   // "1k"
 */
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
