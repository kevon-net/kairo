'use client';

import { capitalizeWord } from '@/utilities/formatters/string';
import {
  Button,
  Chip,
  ChipGroup,
  Group,
  NumberInput,
  Select,
  Stack,
} from '@mantine/core';
import { useState } from 'react';
import {
  getNextWeekdayDate,
  getWeekday,
  sortWeekdaysInOrder,
} from '@/services/logic/time';
import { Frequency, Weekdays } from '@generated/prisma';
import { FormTask } from '@/hooks/form/task';

export default function Repeat({
  props,
}: {
  props: {
    form: FormTask;
    setMounted: (state: boolean) => void;
    setPopover: (state: boolean) => void;
  };
}) {
  const [intervalState, setInterval] = useState<string | number>(
    props.form.values.properties.interval || 1
  );
  const [frequencyState, setFrequency] = useState<string | null>(
    props.form.values.properties.frequency || Frequency.DAY
  );
  const [weekdaysState, setWeekdays] = useState<string[]>(
    props.form.values.properties.weekdays.length
      ? props.form.values.properties.weekdays
      : [
          getWeekday(
            new Date(props.form.values.properties.due_date || new Date())
          ),
        ]
  );

  return (
    <Stack gap={'xs'}>
      <Group grow gap={'xs'}>
        <NumberInput
          size="xs"
          radius="md"
          placeholder="Repeat interval"
          min={1}
          max={100}
          value={intervalState}
          onChange={setInterval}
        />

        <Select
          size="xs"
          data={frequencyArray.map((frequency) => ({
            value: frequency,
            label: capitalizeWord(frequency),
          }))}
          value={frequencyState}
          onChange={setFrequency}
          allowDeselect={false}
          withCheckIcon={false}
        />
      </Group>

      {frequencyState == Frequency.WEEK && (
        <ChipGroup multiple value={weekdaysState} onChange={setWeekdays}>
          <Group gap={0} justify="space-between">
            {weekdayArray.map((day) => (
              <Chip key={day} value={day.toUpperCase()} size={'xs'} radius={0}>
                {capitalizeWord(day)}
              </Chip>
            ))}
          </Group>
        </ChipGroup>
      )}

      <Group gap={'xs'} grow>
        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            props.setMounted(false);
            props.setPopover(false);
          }}
        >
          Close
        </Button>
        <Button
          size="xs"
          disabled={frequencyState == Frequency.WEEK && !weekdaysState.length}
          onClick={() => {
            const newInterval =
              weekdaysState.length == 7 || !intervalState
                ? 1
                : Number(intervalState);

            const newFrequency =
              weekdaysState.length == 7
                ? Frequency.DAY
                : (frequencyState as Frequency);

            let newWeekdays: Weekdays[] = [];
            let newDueDate: string = '';

            if (newFrequency == 'WEEK') {
              const orderedWeekdays = sortWeekdaysInOrder(
                weekdaysState
              ) as Weekdays[];

              newWeekdays = orderedWeekdays;

              newDueDate = getNextWeekdayDate(
                orderedWeekdays,
                true
              ).toISOString();
            } else {
              if (!props.form.values.properties.due_date) {
                newDueDate = now.toISOString();
              } else {
                newDueDate = props.form.values.properties.due_date;
              }
            }

            props.form.setFieldValue('properties.interval', newInterval);
            props.form.setFieldValue('properties.frequency', newFrequency);
            props.form.setFieldValue('properties.weekdays', newWeekdays);
            props.form.setFieldValue('properties.due_date', newDueDate);

            if (props.form.values.properties.time) {
              props.form.setFieldValue('properties.time', newDueDate);
            }

            props.setMounted(false);
            props.setPopover(false);
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}

const now = new Date();
const weekdayArray = Object.values(Weekdays).slice(0, 7) as Weekdays[];
const frequencyArray = Object.values(Frequency);
