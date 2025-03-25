export const getOSTheme = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};
