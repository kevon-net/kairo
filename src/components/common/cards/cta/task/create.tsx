import { Group, Text, ThemeIcon } from '@mantine/core';
import React from 'react';
import ModalTaskCreate from '../../../modals/task/create';
import { IconPlus } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import classes from './create.module.scss';
import { OptionalFormTaskValues } from '@/hooks/form/task';

export default function Create({
  props,
}: {
  props?: { defaultValues?: OptionalFormTaskValues };
}) {
  return (
    <ModalTaskCreate props={{ defaultValues: props?.defaultValues }}>
      <Group
        pl={'calc(var(--mantine-spacing-md) * 3)'}
        className={classes.card}
      >
        <ThemeIcon
          size={ICON_WRAPPER_SIZE / 1.25}
          radius={'xl'}
          className={classes.icon}
        >
          <IconPlus size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH * 1.5} />
        </ThemeIcon>

        <Text>Add task</Text>
      </Group>
    </ModalTaskCreate>
  );
}
