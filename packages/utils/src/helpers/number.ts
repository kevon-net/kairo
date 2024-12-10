export const roundAndTruncate = (
  value: number,
  decimalPlaces: number
): number => {
  try {
    if (decimalPlaces < 0) {
      throw new Error('Decimal places must be a non-negative integer.');
    }

    // Round the value to the specified decimal places
    const factor = Math.pow(10, decimalPlaces);
    const roundedValue = Math.round(value * factor) / factor;

    // Truncate trailing zeros by converting to a string and back to a number
    const truncatedValue = parseFloat(roundedValue.toFixed(decimalPlaces));

    return truncatedValue;
  } catch (error) {
    console.error('---> utility error (round off and truncate):', error);
    throw error;
  }
};
