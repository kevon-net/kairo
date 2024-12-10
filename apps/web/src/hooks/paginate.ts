import { useState, useMemo, useEffect } from 'react';

interface PageRange {
  from: number;
  to: number;
}

const chunk = <T>(array: T[], size: number): T[][] => {
  return array.length
    ? [array.slice(0, size), ...chunk(array.slice(size), size)]
    : [];
};

export const usePaginate = <T>(list: T[], pageSize: number) => {
  const [items, setItems] = useState<T[]>([]);
  const [activePage, setActivePage] = useState(1);

  const chunkedList = useMemo(
    () => (list ? chunk(list, pageSize) : []),
    [list, pageSize]
  );

  const pageRange = useMemo((): PageRange | null => {
    if (!chunkedList.length) return null;

    const lastChunkLength = chunkedList[chunkedList.length - 1].length;
    const isLastChunk =
      lastChunkLength === items.length && lastChunkLength !== pageSize;

    return {
      from: isLastChunk
        ? list.length - items.length + 1
        : (activePage - 1) * pageSize + 1,
      to: isLastChunk ? list.length : activePage * pageSize,
    };
  }, [chunkedList, activePage, list, pageSize, items]);

  useEffect(() => {
    if (!list) return;

    const currentPageItems = chunkedList[activePage - 1];

    if (currentPageItems) {
      setItems(currentPageItems);
    } else if (activePage > 1) {
      setActivePage(activePage - 1);
    } else {
      setItems([]);
    }
  }, [list, activePage, pageSize, chunkedList]);

  return {
    items,
    setItems,
    activePage,
    setActivePage,
    chunkedList,
    pageRange,
  };
};
