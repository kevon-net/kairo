'use client';

import {
  Anchor,
  Card,
  Container,
  createTheme,
  Notification,
  rem,
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
    primaryDark: [
      '#000000', // Black
      '#1a1a1a',
      '#333333',
      '#666666',
      '#808080', // Medium Gray
      '#999999',
      '#b3b3b3',
      '#cccccc',
      '#f2f2f2',
      '#ffffff', // White
    ],

    primaryLight: [
      '#ffffff', // White
      '#cccccc',
      '#b3b3b3',
      '#999999',
      '#808080', // Medium Gray
      '#666666',
      '#4d4d4d',
      '#333333',
      '#1a1a1a',
      '#000000', // Black
    ],

    pri: virtualColor({
      name: 'pri',
      dark: 'primaryDark',
      light: 'primaryLight',
    }),
  },

  primaryColor: 'pri',

  defaultRadius: 'sm',

  primaryShade: { light: 9, dark: 9 },

  defaultGradient: {
    from: 'primaryDark',
    to: 'primaryLight',
    deg: 45,
  },

  cursorType: 'pointer',

  components: {
    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      classNames: classesAnchor,
    }),

    Card: Card.extend({
      defaultProps: {
        bg: 'var(--mantine-color-pri-light)',
        c: 'var(--mantine-color-text)',
      },
    }),

    Container: Container.extend({
      defaultProps: {
        mx: 'auto',
      },

      classNames: (_: any, { size }: { size?: any }) => ({
        root: cx({ [classesContainer.root]: size === 'responsive' }),
      }),
    }),

    Notification: Notification.extend({ classNames: classesNotification }),
  },
});

export default appTheme;
