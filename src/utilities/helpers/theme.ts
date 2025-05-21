import { DEFAULT_COLOR_SCHEME } from '@/data/constants';

export const getOSTheme = (
  colorScheme: 'light' | 'dark' | 'auto'
): 'light' | 'dark' => {
  if (typeof document === 'undefined') return DEFAULT_COLOR_SCHEME;

  if (colorScheme != 'auto') return colorScheme;

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
    return 'dark';

  return 'light';
};
