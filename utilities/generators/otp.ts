export const generateOtpCode = (digits: number = 6) => {
  const min = Math.pow(10, digits - 1); // Minimum value (e.g., 1000 for 4 digits)
  const max = Math.pow(10, digits) - 1; // Maximum value (e.g., 9999 for 4 digits)

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
