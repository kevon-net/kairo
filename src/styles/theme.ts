'use client';

import {
  Anchor,
  Combobox,
  Container,
  createTheme,
  Menu,
  Modal,
  PasswordInput,
  Popover,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';

import cx from 'clsx';
import classesContainer from './mantine/container.module.scss';
import classesAnchor from './mantine/anchor.module.scss';
import classesMenu from './mantine/menu.module.scss';
import classesPopover from './mantine/popover.module.scss';
import classesSelect from './mantine/inputs/select.module.scss';
import classesCombobox from './mantine/inputs/combobox.module.scss';
import classesTextInput from './mantine/inputs/text.module.scss';
import classesTextarea from './mantine/inputs/textarea.module.scss';
import classesPasswordInput from './mantine/inputs/password.module.scss';

const appTheme = createTheme({
  primaryColor: 'pri',
  defaultRadius: 'sm',
  primaryShade: { light: 5, dark: 5 },
  cursorType: 'pointer',

  colors: {
    pri: [
      '#fef4e8',
      '#f2e7dc',
      '#decebc',
      '#cbb399',
      '#ba9c7b',
      '#b08e67', // src (5)
      '#ac865c',
      '#97734b',
      '#876640',
      '#775732',
    ],
  },

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

    Anchor: Anchor.extend({
      defaultProps: { underline: 'never' },
      classNames: classesAnchor,
    }),

    Menu: Menu.extend({
      defaultProps: {
        transitionProps: {
          enterDelay: 0,
          duration: 100,
          exitDuration: 100,
          exitDelay: 0,
        },
      },
      classNames: classesMenu,
    }),

    Popover: Popover.extend({
      defaultProps: {
        transitionProps: {
          enterDelay: 0,
          duration: 100,
          exitDuration: 100,
          exitDelay: 0,
        },
      },
      classNames: classesPopover,
    }),

    Modal: Modal.extend({
      defaultProps: {
        transitionProps: {
          enterDelay: 0,
          duration: 100,
          exitDuration: 100,
          exitDelay: 0,
          transition: 'fade',
        },
        overlayProps: {
          backgroundOpacity: 0.25,
          blur: 4,
        },
      },
    }),

    Tooltip: Tooltip.extend({
      defaultProps: {
        color: 'dark.9',
        fz: 'xs',
        withArrow: true,
        transitionProps: {
          transition: 'fade',
          duration: 100,
          exitDuration: 100,
          enterDelay: 500,
          exitDelay: 0,
        },
      },
    }),

    Select: Select.extend({
      classNames: classesSelect,
    }),

    Combobox: Combobox.extend({
      classNames: classesCombobox,
    }),

    TextInput: TextInput.extend({
      classNames: classesTextInput,
    }),

    Textarea: Textarea.extend({
      classNames: classesTextarea,
    }),

    PasswordInput: PasswordInput.extend({
      classNames: classesPasswordInput,
    }),
  },
});

export default appTheme;
