import { Order } from '@/enums/sort';

export const isFirstItem = <T>(array: T[], item: T): boolean => {
  return array[0] === item;
};

export const isLastItem = <T>(array: T[], item: T): boolean => {
  return array[array.length - 1] === item;
};

export const sortArray = <T>(
  array: T[],
  property: keyof T,
  order: Order
): T[] => {
  const items = {
    valid: array.filter(
      (item) => item[property] !== null && item[property] !== undefined
    ),
    null: array.filter(
      (item) => item[property] === null || item[property] === undefined
    ),
  };

  const itemsValidSorted = items.valid.sort((a, b) => {
    try {
      const aValue = a[property];
      const bValue = b[property];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === Order.ASCENDING
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return order === Order.ASCENDING
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === Order.ASCENDING ? aValue - bValue : bValue - aValue;
      }

      // Handle cases where types are inconsistent or not comparable
      throw new Error(
        `Comparison not supported between ${typeof aValue} and ${typeof bValue} for property ${property as string}`
      );
    } catch (error) {
      console.error(`---> utility error (sort array):`, error);
      throw error;
    }
  });

  return [...itemsValidSorted, ...items.null];
};
