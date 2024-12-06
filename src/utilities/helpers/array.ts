import { Order } from '@/enums/sort';

export const isFirstItem = <T>(array: T[], item: T): boolean => {
  return array[0] === item;
};

export const isLastItem = <T>(array: T[], item: T): boolean => {
  return array[array.length - 1] === item;
};

export const sortArray = <T>(
  array: T[],
  getField: (item: T) => any | undefined,
  order: Order
): T[] => {
  const items = {
    valid: array.filter(
      (item) => getField(item) !== null && getField(item) !== undefined
    ),
    null: array.filter(
      (item) => getField(item) === null || getField(item) === undefined
    ),
  };

  const itemsValidSorted = items.valid.sort((a, b) => {
    try {
      const aValue = getField(a);
      const bValue = getField(b);

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
        `Comparison not supported between ${typeof aValue} and ${typeof bValue} for the selcted property`
      );
    } catch (error) {
      console.error(`---> utility error (sort array):`, error);
      throw error;
    }
  });

  return [...itemsValidSorted, ...items.null];
};
