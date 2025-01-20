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

export const getPartitions = (
  count: number, // Number of variables to return
  multiplier: number, // Multiplier for the next number
  totalSum: number // The desired sum of the array
): number[] => {
  if (count <= 0 || multiplier <= 0 || totalSum <= 0) {
    throw new Error('All inputs must be positive numbers.');
  }

  // Generate the weights for the array based on the multiplier
  const weights = Array.from({ length: count }, (_, i) =>
    Math.pow(multiplier, i)
  );

  // Calculate the total weight sum
  const weightSum = weights.reduce((acc, weight) => acc + weight, 0);

  // Scale the weights to match the desired total sum
  const result = weights.map((weight) => (weight / weightSum) * totalSum);

  // Round to 2 decimal places to avoid floating-point precision issues
  return result.map((num) => parseFloat(num.toFixed(2)));
};
