'use client';

import { FormTask } from '@/hooks/form/task';
import { Group, Textarea } from '@mantine/core';
import React from 'react';
import classes from './create.module.scss';
import ComboboxTaskDue from '@/components/common/inputs/combobox/task/due';
import ComboboxTaskTime from '@/components/common/inputs/combobox/task/time';
import ComboboxTaskRepeat from '@/components/common/inputs/combobox/task/repeat';
import ComboboxTaskPriority from '@/components/common/inputs/combobox/task/priority';

export default function Create({ props }: { props: { form: FormTask } }) {
  return (
    <>
      <div>
        <Textarea
          w={'100%'}
          minRows={1}
          maxRows={3}
          autosize
          placeholder="Add task title here"
          variant="unstyled"
          key={props.form.key('title')}
          {...props.form.getInputProps('title')}
          classNames={{ input: classes.title }}
          data-autofocus
        />

        <Textarea
          w={'100%'}
          minRows={2}
          maxRows={5}
          autosize
          placeholder="Add task description here"
          variant="unstyled"
          key={props.form.key('description')}
          {...props.form.getInputProps('description')}
          classNames={{ input: classes.desc }}
        />
      </div>

      <Group gap={'xs'} mt={'xs'}>
        <ComboboxTaskDue props={{ form: props.form }} />
        <ComboboxTaskTime props={{ form: props.form }} />
        <ComboboxTaskRepeat props={{ form: props.form }} />
        <ComboboxTaskPriority props={{ formTask: props.form }} />
      </Group>
    </>
  );
}
