/**
 * Generates random name initials (two uppercase letters)
 * @returns Random initials in uppercase (e.g., "JD")
 */
export const generateRandomInitials = (): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstInitial = alphabet.charAt(
    Math.floor(Math.random() * alphabet.length)
  );
  const lastInitial = alphabet.charAt(
    Math.floor(Math.random() * alphabet.length)
  );

  return firstInitial + lastInitial;
};
