import { ICON_WRAPPER_SIZE } from '@/data/constants';
import { FormTask } from '@/hooks/form/task';
import { getPriorityColor } from '@/services/logic/priorityColor';
import { Checkbox } from '@mantine/core';
import { Priority } from '@generated/prisma';
import React from 'react';

export default function Task({ props }: { props: { form: FormTask } }) {
  return (
    <Checkbox
      radius="xl"
      key={props.form.key('properties.complete')}
      {...props.form.getInputProps('properties.complete', { type: 'checkbox' })}
      styles={{
        input: {
          width: ICON_WRAPPER_SIZE / 1.5,
          height: ICON_WRAPPER_SIZE / 1.5,
          border: `1.5px solid ${props.form.values.properties.complete ? 'var(--mantine-color-pri-7)' : getPriorityColor(props.form.values.properties.priority as Priority) || 'var(--mantine-color-white)'}`,
        },
        icon: {
          width: ICON_WRAPPER_SIZE / 3,
          height: ICON_WRAPPER_SIZE / 3,
          marginRight: 6,
        },
      }}
    />
  );
}
