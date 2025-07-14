'use client';

import {
  CloseButton,
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  Group,
  InputBase,
  InputPlaceholder,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Text,
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@/hooks/form/task';
import { getRegionalDate } from '@/utilities/formatters/date';
import {
  Icon,
  IconCalendarCog,
  IconCalendarDown,
  IconCalendarEvent,
  IconCalendarShare,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, TIME_FORMAT } from '@/data/constants';
import {
  getDueButtonLabel,
  getNextWeek,
  getTomorrow,
} from '@/services/logic/time';
import { useState } from 'react';
import InputCalendarDue from '../../calendar/due';
import { Frequency } from '@generated/prisma';

export default function DueDate({
  props,
}: {
  props: { form: FormTask; inputProps?: { width?: any } };
}) {
  const [mounted, setMounted] = useState(false);
  const [popover, setPopover] = useState(false);

  const combobox = useCombobox({
    opened: mounted,
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = items.map((item, index) => (
    <ComboboxOption key={index} value={item.value.toISOString()}>
      {item.component}
    </ComboboxOption>
  ));

  const popoverTarget = (
    <InputBase
      styles={{
        input: {
          backgroundColor: 'var(--mantine-color-body)',
        },
      }}
      component="button"
      type="button"
      size="xs"
      p={0}
      w={props.inputProps?.width || 'fit-content'}
      pointer
      rightSection={
        props.form.values.properties.due_date ? (
          <CloseButton
            size="sm"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (props.form.values.properties.frequency) {
                props.form.setFieldValue(
                  'properties.frequency',
                  '' as Frequency
                );
                props.form.setFieldValue('properties.interval', 1);
                props.form.setFieldValue('properties.weekdays', []);
              }

              props.form.setFieldValue('properties.due_date', '');
              setMounted(false);
            }}
            aria-label="Clear value"
          />
        ) : (
          <ComboboxChevron />
        )
      }
      onClick={() => setMounted(true)}
      rightSectionPointerEvents={
        !props.form.values.properties.due_date ? 'none' : 'all'
      }
    >
      <Group gap={'xs'} fz={'sm'} pr={'xs'}>
        {props.form.values.properties.due_date ? (
          <Group gap={'xs'}>
            <IconCalendarEvent
              size={ICON_SIZE / 1.25}
              stroke={ICON_STROKE_WIDTH}
            />
            {getDueButtonLabel({
              date: new Date(props.form.values.properties.due_date),
            })}
          </Group>
        ) : (
          <InputPlaceholder fz={'sm'}>
            <Group gap={'xs'}>
              <IconCalendarEvent
                size={ICON_SIZE / 1.25}
                stroke={ICON_STROKE_WIDTH}
              />
              Date
            </Group>
          </InputPlaceholder>
        )}
      </Group>
    </InputBase>
  );

  return !popover ? (
    <Combobox
      store={combobox}
      withinPortal={false}
      onDismiss={() => setMounted(false)}
      onOptionSubmit={(val) => {
        if (val === 'custom') {
          setPopover(true);
          return;
        }

        props.form.setFieldValue('properties.due_date', val);
        setMounted(false);
      }}
    >
      <ComboboxTarget>{popoverTarget}</ComboboxTarget>

      <ComboboxDropdown miw={200}>
        <ComboboxOptions>
          {options}

          <ComboboxOption value={'custom'} onClick={(e) => e.preventDefault()}>
            <Option props={{ icon: IconCalendarCog }}>Pick a date</Option>
          </ComboboxOption>
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  ) : (
    <Popover
      position="bottom-end"
      shadow="md"
      opened={true}
      onDismiss={() => {
        setMounted(false);
        setPopover(false);
      }}
    >
      <PopoverTarget>{popoverTarget}</PopoverTarget>

      <PopoverDropdown p={'xs'}>
        <InputCalendarDue
          props={{
            form: props.form,
            setMounted: (state) => setMounted(state),
            setPopover: (state) => setPopover(state),
          }}
        />
      </PopoverDropdown>
    </Popover>
  );
}

const currentDate = new Date();

const items = [
  {
    value: currentDate,
    component: (
      <Option props={{ date: currentDate, icon: IconCalendarDown }}>
        Today
      </Option>
    ),
  },
  {
    value: getTomorrow(),
    component: (
      <Option props={{ date: getTomorrow(), icon: IconCalendarShare }}>
        Tomorrow
      </Option>
    ),
  },
  {
    value: getNextWeek(),
    component: (
      <Option props={{ date: getNextWeek(), icon: IconCalendarShare }}>
        Next Week
      </Option>
    ),
  },
];

function Option({
  props,
  children,
}: {
  props: { date?: Date; icon: Icon };
  children: React.ReactNode;
}) {
  return (
    <Group justify="space-between" gap={'xs'}>
      <Group gap={'xs'}>
        <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        <span>{children}</span>
      </Group>

      {props.date && (
        <Text component="span" c={'dimmed'} fz={'xs'}>
          {
            getRegionalDate(props.date, {
              locale: TIME_FORMAT.LOCALE,
              format: 'weekday',
            }).date
          }
        </Text>
      )}
    </Group>
  );
}
