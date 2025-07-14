'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Stack,
  Card,
  CardSection,
  Divider,
  Text,
  Group,
  Select,
  Button,
} from '@mantine/core';
import InputIndicatorTaskView from '../inputs/floating-indicator/task-view';
import ComboboxTaskPriority from '../inputs/combobox/task/priority';
import ComboboxTaskProject from '../inputs/combobox/task/project';
import { useFormTaskView } from '@/hooks/form/task/view';
import { GroupSort } from '@generated/prisma';

export default function View({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);
  const { form, exclusion, updateView } = useFormTaskView();
  const optionsWithExclusion = options.filter((o) => o.value != exclusion);
  const groupOptions = optionsWithExclusion;
  const sortOptions = optionsWithExclusion;

  return (
    <Popover
      opened={opened}
      onDismiss={() => setOpened(false)}
      width={320}
      position="bottom-end"
      shadow="xs"
    >
      <PopoverTarget>
        <div onClick={() => setOpened(!opened)}>{children}</div>
      </PopoverTarget>

      <PopoverDropdown p={0}>
        <Card padding={'xs'} bg={'transparent'}>
          <InputIndicatorTaskView />

          <CardSection>
            <Divider mb={5} mt={'xs'} />
          </CardSection>

          <Stack gap={'xs'}>
            <Text fw={500} fz={'sm'}>
              Sort
            </Text>

            <Stack gap={5}>
              <Group justify="space-between">
                <Text fz={'sm'}>Grouping</Text>

                <Select
                  size="xs"
                  placeholder="Pick value"
                  data={groupOptions.filter((g) => {
                    // exclude selected sort option (except when empty)
                    if (form.values.sortBy) {
                      return g.value != form.values.sortBy;
                    } else {
                      return true;
                    }
                  })}
                  withCheckIcon={false}
                  allowDeselect={false}
                  key={form.key('groupBy')}
                  {...form.getInputProps('groupBy')}
                />
              </Group>

              <Group justify="space-between">
                <Text fz={'sm'}>Sorting</Text>

                <Select
                  size="xs"
                  placeholder="Pick value"
                  data={sortOptions.filter((g) => {
                    // exclude selected group option (except when empty)
                    if (form.values.groupBy) {
                      return g.value != form.values.groupBy;
                    } else {
                      return true;
                    }
                  })}
                  withCheckIcon={false}
                  allowDeselect={false}
                  key={form.key('sortBy')}
                  {...form.getInputProps('sortBy')}
                />
              </Group>
            </Stack>
          </Stack>

          <CardSection>
            <Divider mb={5} mt={'xs'} />
          </CardSection>

          <Stack gap={'xs'}>
            <Text fw={500} fz={'sm'}>
              Filter
            </Text>

            <Stack gap={5}>
              <Group justify="space-between">
                <Text fz={'sm'}>Priority</Text>

                <ComboboxTaskPriority props={{ formTaskView: form }} />
              </Group>

              {exclusion != 'category' && (
                <Group justify="space-between">
                  <Text fz={'sm'}>Category</Text>

                  <ComboboxTaskProject props={{ formTaskView: form }} />
                </Group>
              )}
            </Stack>
          </Stack>

          {form.isDirty() && (
            <>
              <CardSection>
                <Divider mt={'xs'} />
              </CardSection>

              <CardSection p={'xs'}>
                <Button
                  color="red.6"
                  variant="subtle"
                  fullWidth
                  size="xs"
                  onClick={() => {
                    setOpened(false);
                    // reset form values by values
                    form.reset();
                    updateView({ reset: true });
                  }}
                >
                  Reset All
                </Button>
              </CardSection>
            </>
          )}
        </Card>
      </PopoverDropdown>
    </Popover>
  );
}

const options = [
  {
    label: 'None (Default)',
    value: '',
  },
  {
    label: 'Category',
    value: GroupSort.CATEGORY,
  },
  {
    label: 'Priority',
    value: GroupSort.PRIORITY,
  },
  {
    label: 'Date',
    value: GroupSort.DATE,
  },
];
