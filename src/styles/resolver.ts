'use client';

import { alpha, CSSVariablesResolver } from '@mantine/core';

const appResolver: CSSVariablesResolver = (theme) => ({
  variables: {},

  light: {
    '--mantine-color-white': `${theme.white}`,
    '--mantine-color-body': `${theme.white}`,

    '--mantine-color-text': `${theme.black}`,
    '--mantine-color-pri-outline': `${theme.black}`,
    '--mantine-color-pri-light-color': `${theme.black}`,

    '--mantine-color-anchor': `${theme.colors.pri[4]}`,
    '--mantine-color-default-border': `${theme.colors.pri[4]}`,

    '--menu-item-hover': `var(--mantine-color-pri-light)`,

    '--mantine-shadow-xs': `0 0.0625rem 0.1875rem ${alpha(theme.colors.pri[9], 0.05)}, 0 0.0625rem 0.125rem ${alpha(
      theme.colors.pri[9],
      0.1
    )}`,
  },

  dark: {
    '--mantine-color-white': `${theme.black}`,
    '--mantine-color-body': `${theme.black}`,

    '--mantine-color-text': `${theme.white}`,
    '--mantine-color-pri-outline': `${theme.white}`,
    '--mantine-color-pri-light-color': `${theme.white}`,

    '--mantine-color-anchor': `${theme.colors.pri[4]}`,
    '--mantine-color-default-border': `${theme.colors.pri[4]}`,

    '--menu-item-hover': `var(--mantine-color-pri-light)`,

    '--mantine-shadow-xs': `0 0.0625rem 0.1875rem ${alpha(theme.colors.pri[9], 0.05)}, 0 0.0625rem 0.125rem ${alpha(
      theme.colors.pri[9],
      0.1
    )}`,
  },
});

export default appResolver;
