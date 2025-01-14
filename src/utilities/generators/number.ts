export const generateRandomPrime = (max: number): number => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  if (max <= 1) return 2;
  return primes[Math.floor(Math.random() * primes.length)];
};

export const generateSeededPrime = (seed: string, index: number): number => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
  const hash = seed.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1);
  }, 0);
  return primes[(hash + index) % primes.length];
};

export const getRandomIntInRange = (min: number, max: number): number => {
  // Ensure min and max are valid integers
  if (min < 1 || max < 1) {
    throw new Error('Both min and max must be greater than or equal to 1.');
  }

  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max must be integers.');
  }

  if (min > max) {
    throw new Error('Min cannot be greater than max.');
  }

  // Generate a random integer within the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
