import { Order } from '@repo/enums';
import { useState } from 'react';
import { sortArray } from '@repo/utils/helpers';

export const useSortArray = <T>(
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  getField: (item: T) => any | undefined // (item) => item
) => {
  const [orderMap, setOrderMap] = useState<Record<string, Order>>({});

  const sortItems = (field: keyof T) => {
    setOrderMap((orderMap) => {
      const currentOrder = orderMap[field as string] || Order.DEFAULT;
      const nextOrder =
        currentOrder === Order.DEFAULT || currentOrder === Order.DESCENDING
          ? Order.ASCENDING
          : Order.DESCENDING;

      setList((list) => sortArray([...list], getField, nextOrder)); // Create a copy

      return { ...orderMap, [field]: nextOrder };
    });
  };

  return { sortBy: sortItems, orderMap };
};
