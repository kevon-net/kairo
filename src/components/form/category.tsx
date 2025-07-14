import { Stack, Text, TextInput } from '@mantine/core';
import React from 'react';
import { FormCategory } from '@/hooks/form/category';
import InputComboboxColor from '../common/inputs/combobox/color';

export default function Category({
  props,
}: {
  props: {
    form: FormCategory;
    submitted: boolean;
    handleAction: () => void;
    addToState: () => void;
    updateState: () => void;
    editing: boolean;
    close: () => void;
    opened: boolean;
    submit: () => void;
  };
}) {
  return (
    <form onSubmit={props.form.onSubmit(props.submit)} noValidate>
      <Stack>
        <TextInput
          required
          label="Name"
          placeholder="Project Name"
          {...props.form.getInputProps('title')}
          data-autofocus
        />

        <div>
          <Text component="span" inherit fw={500} fz={'sm'}>
            Color
          </Text>

          <InputComboboxColor props={{ form: props.form }} />
        </div>
      </Stack>
    </form>
  );
}
