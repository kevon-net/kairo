'use client';

import { alpha, CSSVariablesResolver } from '@mantine/core';

const appResolver: CSSVariablesResolver = (theme) => ({
  variables: {},

  light: {
    '--mantine-color-body': `${theme.white}`,
    '--mantine-color-text': `var(--mantine-color-dark-6)`,
  },

  dark: {
    '--mantine-color-body': `var(--mantine-color-priBlack-8)`,
    '--mantine-color-text': `var(--mantine-color-dark-0)`,
    '--mantine-shadow-xs': `0 0.0625rem 0.1875rem ${alpha(theme.black, 0.05)}, 0 0.0625rem 0.125rem ${alpha(
      theme.black,
      0.1
    )}`,
  },
});

export default appResolver;
