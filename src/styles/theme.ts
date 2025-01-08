'use client';

import {
  Anchor,
  Card,
  Container,
  createTheme,
  Notification,
  PasswordInput,
  Textarea,
  TextInput,
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
    priWhite: [
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

    priBlack: [
      '#ffffff', // White
      '#f2f2f2',
      '#cccccc',
      '#b3b3b3',
      '#999999', // Medium Gray
      '#808080',
      '#666666',
      '#333333',
      '#1a1a1a',
      '#000000', // Black
    ],

    pri: virtualColor({
      name: 'pri',
      light: 'blue',
      dark: 'yellow',
    }),
  },

  primaryColor: 'pri',

  defaultRadius: 'sm',

  primaryShade: { light: 6, dark: 6 },

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

    TextInput: TextInput.extend({
      defaultProps: { variant: 'filled' },
    }),

    Textarea: Textarea.extend({
      defaultProps: { variant: 'filled' },
    }),

    PasswordInput: PasswordInput.extend({
      defaultProps: { variant: 'filled' },
    }),

    Notification: Notification.extend({ classNames: classesNotification }),
  },
});

export default appTheme;
