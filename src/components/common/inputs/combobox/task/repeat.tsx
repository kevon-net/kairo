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
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@/hooks/form/task';
import { getRegionalDate } from '@/utilities/formatters/date';
import {
  Icon,
  IconCalendarCog,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarMonth,
  IconCalendarPlus,
  IconCalendarWeek,
  IconRepeat,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, TIME_FORMAT } from '@/data/constants';
import {
  getNextWeekdays,
  getRepeatButtonLabel,
  sortWeekdaysInOrder,
} from '@/services/logic/time';
import { useState } from 'react';
import FormTaskCreateRepeat from '@/components/form/task/create/repeat';
import { Frequency, Weekdays } from '@generated/prisma';

type Recurrence = {
  frequency: Frequency;
  weekdays: Weekdays[];
  interval: number;
};

export default function Repeat({
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
    <ComboboxOption key={index} value={item.value}>
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
        props.form.values.properties.frequency ? (
          <CloseButton
            size="sm"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              props.form.setFieldValue('properties.frequency', '' as Frequency);
              props.form.setFieldValue('properties.interval', 1);
              props.form.setFieldValue('properties.weekdays', []);
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
        !props.form.values.properties.frequency ? 'none' : 'all'
      }
    >
      <Group gap={'xs'} fz={'sm'} pr={'xs'}>
        {props.form.values.properties.frequency ? (
          <Group gap={'xs'}>
            <IconRepeat size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />

            {getRepeatButtonLabel({
              frequency: props.form.values.properties.frequency as Frequency,
              interval: props.form.values.properties.interval,
              weekdays: sortWeekdaysInOrder(
                props.form.values.properties.weekdays as Weekdays[]
              ) as Weekdays[],
            })}
          </Group>
        ) : (
          <InputPlaceholder fz={'sm'}>
            <Group gap={'xs'}>
              <IconRepeat size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
              Recurrence
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
        const parsedValues: Recurrence = JSON.parse(val);

        if ((parsedValues as any).custom) {
          setPopover(true);
          return;
        }

        if (!props.form.values.properties.due_date) {
          props.form.setFieldValue(
            'properties.due_date',
            currentDate.toISOString()
          );
        }

        props.form.setFieldValue(
          'properties.frequency',
          parsedValues.frequency
        );
        props.form.setFieldValue('properties.interval', parsedValues.interval);
        props.form.setFieldValue(
          'properties.weekdays',
          sortWeekdaysInOrder(parsedValues.weekdays) as Weekdays[]
        );

        setMounted(false);
      }}
    >
      <ComboboxTarget>{popoverTarget}</ComboboxTarget>

      <ComboboxDropdown miw={200}>
        <ComboboxOptions>
          {options}

          <ComboboxOption
            value={JSON.stringify({ custom: true })}
            onClick={(e) => e.preventDefault()}
          >
            <Option props={{ icon: IconCalendarCog }}>Custom</Option>
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
        // setPopover(false);
      }}
    >
      <PopoverTarget>{popoverTarget}</PopoverTarget>

      <PopoverDropdown p={'xs'}>
        <FormTaskCreateRepeat
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
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.DAY as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarDue }}>Daily</Option>,
  },
  {
    value: JSON.stringify({
      date: getNextWeekdays(currentDate)[0],
      frequency: Frequency.WEEK as Frequency,
      interval: 1 as number,
      weekdays: getNextWeekdays(currentDate, true).map((day) =>
        getRegionalDate(day, { locale: TIME_FORMAT.LOCALE, format: 'weekday' })
          .date.slice(0, 2)
          .toUpperCase()
      ),
    }),
    component: <Option props={{ icon: IconCalendarEvent }}>Weekdays</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.WEEK as Frequency,
      interval: 1 as number,
      weekdays: [
        getRegionalDate(currentDate, {
          locale: TIME_FORMAT.LOCALE,
          format: 'weekday',
        })
          .date.slice(0, 2)
          .toUpperCase(),
      ],
    }),
    component: <Option props={{ icon: IconCalendarWeek }}>Weekly</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.MONTH as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarMonth }}>Monthly</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.YEAR as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarPlus }}>Yearly</Option>,
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
    <Group gap={'xs'}>
      <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      <span>{children}</span>
    </Group>
  );
}
