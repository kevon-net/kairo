'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { Box, Button, Divider, Group, Skeleton, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useTaskActions } from '@/hooks/actions/tasks';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardTaskMain from '@/components/common/cards/task/main';
import { sortArray } from '@/utilities/helpers/array';
import { Order } from '@/enums/sort';

export default function Tasks() {
  const { category, filteredTasks } = useTabAside();
  const { createTask } = useTaskActions();

  return (
    <div>
      {filteredTasks.length > 0 && (
        <Box
          pos={'sticky'}
          top={48}
          bg={
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))'
          }
          style={{ zIndex: 1 }}
        >
          <Divider />

          <Group gap={5} pos={'sticky'} top={48} py={'xs'} justify="center">
            {filteredTasks == null ? (
              <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
            ) : (
              <Button
                size="xs"
                leftSection={
                  <IconPlus size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                }
                onClick={() =>
                  createTask({ values: { category_id: category?.id } })
                }
              >
                Add new task
              </Button>
            )}
          </Group>
        </Box>
      )}

      <Stack gap={'xs'}>
        {filteredTasks == null ? (
          <>skeletons</>
        ) : filteredTasks.length == 0 ? (
          <PlaceholderEmpty
            props={{
              title: `No Tasks Found`,
              desc: `Add ${capitalizeWords(category?.title || '')} tasks to get started`,
            }}
          >
            <Button
              size="xs"
              onClick={() =>
                createTask({ values: { category_id: category?.id } })
              }
            >
              Add task
            </Button>
          </PlaceholderEmpty>
        ) : (
          sortArray(filteredTasks, (i) => i.created_at, Order.DESCENDING)?.map(
            (ft, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Divider />}

                <CardTaskMain item={ft} />
              </React.Fragment>
            )
          )
        )}
      </Stack>
    </div>
  );
}
