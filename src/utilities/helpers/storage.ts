'use client';

export const saveToLocalStorage = (name: string, item: any): void => {
  if (typeof document === 'undefined') {
    return;
  }

  try {
    const serializedItem = JSON.stringify(item);
    localStorage.setItem(name, serializedItem);
  } catch (error) {
    console.error('---> utility error (save to local storage):', error);
  }
};

export const getFromLocalStorage = (name: string): any | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const serializedItem = localStorage.getItem(name);
    if (serializedItem === null) {
      return null;
    }

    return JSON.parse(serializedItem);
  } catch (error) {
    console.error('---> utility error (get from local storage):', error);
    return null;
  }
};
