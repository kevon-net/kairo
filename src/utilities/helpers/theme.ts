import { DEFAULT_COLOR_SCHEME } from '@/data/constants';
import { ColorScheme } from '@/types/theme';

export const getOSTheme = (colorScheme: ColorScheme): 'light' | 'dark' => {
  if (typeof document === 'undefined') return DEFAULT_COLOR_SCHEME;

  if (colorScheme != 'auto') return colorScheme;

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
    return 'dark';

  return 'light';
};
