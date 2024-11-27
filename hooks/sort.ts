import { SortOrder } from '@/types/enums';
import { useState } from 'react';

/**
 * dynamic button implementation
 * orderMap.property === 'asc' ? '↑' : orderMap.property === 'desc' ? '↓' : ''
 */

export const useSort = <T>(
  setList: React.Dispatch<React.SetStateAction<T[]>>
) => {
  const [orderMap, setOrderMap] = useState<Record<string, SortOrder>>({});

  const sortItems = (field: keyof T) => {
    setOrderMap((prevOrderMap) => {
      const currentOrder = prevOrderMap[field as string] || SortOrder.DEFAULT;
      let nextOrder: SortOrder = SortOrder.ASCENDING;

      if (
        currentOrder === SortOrder.DEFAULT ||
        currentOrder === SortOrder.DESCENDING
      ) {
        nextOrder = SortOrder.ASCENDING;

        setList((list: T[]) => {
          const validItems = list.filter(
            (item) => item[field] !== null && item[field] !== undefined
          );
          const nullItems = list.filter(
            (item) => item[field] === null || item[field] === undefined
          );

          validItems.sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return aValue.localeCompare(bValue);
            } else if (aValue instanceof Date && bValue instanceof Date) {
              return aValue.getTime() - bValue.getTime();
            } else if (
              typeof aValue === 'number' &&
              typeof bValue === 'number'
            ) {
              return aValue - bValue;
            } else {
              return 0;
            }
          });

          return [...validItems, ...nullItems];
        });
      } else {
        nextOrder = SortOrder.DESCENDING;

        setList((list: T[]) => {
          const validItems = list.filter(
            (item) => item[field] !== null && item[field] !== undefined
          );
          const nullItems = list.filter(
            (item) => item[field] === null || item[field] === undefined
          );

          validItems.sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return bValue.localeCompare(aValue);
            } else if (aValue instanceof Date && bValue instanceof Date) {
              return bValue.getTime() - aValue.getTime();
            } else if (
              typeof aValue === 'number' &&
              typeof bValue === 'number'
            ) {
              return bValue - aValue;
            } else {
              return 0;
            }
          });

          return [...validItems, ...nullItems];
        });
      }

      return { ...prevOrderMap, [field]: nextOrder };
    });
  };

  return { sortBy: sortItems, orderMap };
};
