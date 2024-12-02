import { Order } from '@/enums/sort';
import { useState } from 'react';
import { sortArray } from '@/utilities/helpers/array';

export const useSort = <T>(
  setList: React.Dispatch<React.SetStateAction<T[]>>
) => {
  const [orderMap, setOrderMap] = useState<Record<string, Order>>({});

  const sortItems = (field: keyof T) => {
    setOrderMap((orderMap) => {
      const currentOrder = orderMap[field as string] || Order.DEFAULT;
      const nextOrder =
        currentOrder === Order.DEFAULT || currentOrder === Order.DESCENDING
          ? Order.ASCENDING
          : Order.DESCENDING;

      setList((list) => sortArray([...list], field, nextOrder)); // Create a copy

      return { ...orderMap, [field]: nextOrder };
    });
  };

  return { sortBy: sortItems, orderMap };
};
