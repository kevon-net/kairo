'use client';

import React from 'react';
import {
  InputBase,
  Combobox,
  useCombobox,
  ComboboxTarget,
  InputPlaceholder,
  ComboboxOption,
  ComboboxDropdown,
  ComboboxOptions,
  Group,
  ScrollAreaAutosize,
} from '@mantine/core';
import { FormCategory } from '@/hooks/form/category';
import { IconCheck, IconCircleFilled } from '@tabler/icons-react';
import { APPSHELL, ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { category as categoryColors } from '@/data/colors';

export default function Color({ props }: { props: { form: FormCategory } }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = categoryColors.map((item, index) => (
    <ComboboxOption
      value={item.value}
      key={index}
      active={item.value == props.form.values.color}
    >
      <Group justify="space-between" wrap="nowrap">
        <Placeholder props={item} />

        {item.value == props.form.values.color && (
          <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        )}
      </Group>
    </ComboboxOption>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        props.form.setFieldValue('color', val);
        combobox.closeDropdown();
      }}
    >
      <ComboboxTarget>
        <InputBase
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-body)',
            },
          }}
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {props.form.values.color ? (
            <Placeholder
              props={categoryColors.find(
                (c) => c.value == props.form.values.color
              )}
            />
          ) : (
            <InputPlaceholder>Select color</InputPlaceholder>
          )}
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown>
        <ComboboxOptions>
          <ScrollAreaAutosize
            type="auto"
            mah={200}
            scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
            scrollbars={'y'}
          >
            {options}
          </ScrollAreaAutosize>
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
}

function Placeholder({ props }: { props?: { value: string; label: string } }) {
  return (
    props && (
      <Group gap={'xs'}>
        <IconCircleFilled color={props.value} size={ICON_SIZE / 2} />
        <span>{props.label}</span>
      </Group>
    )
  );
}
