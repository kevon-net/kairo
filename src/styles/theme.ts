'use client';

import cx from 'clsx';
import { Container, createTheme } from '@mantine/core';
import classesContainer from './mantine/container.module.scss';

const appTheme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  primaryShade: { light: 6, dark: 6 },
  cursorType: 'pointer',

  headings: {
    fontFamily: 'var(--font-geist-sans)',
  },

  components: {
    Container: Container.extend({
      defaultProps: {
        mx: 'auto',
      },

      classNames: (_: unknown, { size }: { size?: unknown }) => ({
        root: cx({ [classesContainer.root]: size === 'responsive' }),
      }),
    }),
  },
});

export default appTheme;
