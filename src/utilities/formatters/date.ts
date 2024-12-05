export const isFutureDate = (date: Date): boolean => {
  return date.getTime() > new Date().getTime();
};

export const isPastDate = (date: Date): boolean => {
  return date.getTime() < new Date().getTime();
};
