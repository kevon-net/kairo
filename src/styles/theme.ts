'use client';

import {
  Anchor,
  Container,
  createTheme,
  Notification,
  virtualColor,
} from '@mantine/core';
import cx from 'clsx';
import classesNotification from './mantine/notification.module.scss';
import classesContainer from './mantine/container.module.scss';
import classesAnchor from './mantine/anchor.module.scss';

const appTheme = createTheme({
  focusClassName: 'focus',
  activeClassName: 'active',

  colors: {
    pri: virtualColor({
      name: 'pri',
      light: 'blue',
      dark: 'cyan',
    }),
  },

  primaryColor: 'pri',

  defaultRadius: 'sm',

  primaryShade: { light: 6, dark: 6 },

  // autoContrast: true,
  // luminanceThreshold: 0.3,

  defaultGradient: {
    from: 'red',
    to: 'blue',
    deg: 45,
  },

  cursorType: 'pointer',

  components: {
    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      classNames: classesAnchor,
    }),

    Container: Container.extend({
      defaultProps: {
        mx: 'auto',
      },

      classNames: (_: unknown, { size }: { size?: unknown }) => ({
        root: cx({ [classesContainer.root]: size === 'responsive' }),
      }),
    }),

    Notification: Notification.extend({ classNames: classesNotification }),
  },
});

export default appTheme;
