'use client';

// Save an item to local storage
export const saveToLocalStorage = (name: string, item: any): void => {
  try {
    const serializedItem = JSON.stringify(item);
    localStorage.setItem(name, serializedItem);
  } catch (error) {
    console.error('---> utility error (save to local storage):', error);
  }
};

// Get an item from local storage
export const getFromLocalStorage = (name: string): any => {
  try {
    const serializedItem = localStorage.getItem(name);
    if (serializedItem === null) {
      return null; // Return null if the item doesn't exist
    }
    return JSON.parse(serializedItem);
  } catch (error) {
    console.error('---> utility error (get from local storage):', error);
    return null;
  }
};
