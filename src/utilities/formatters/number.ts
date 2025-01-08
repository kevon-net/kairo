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
