'use client';

import { Button, Stack } from '@mantine/core';
import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useTaskActions } from '@/hooks/actions/tasks';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardTaskMain from '@/components/common/cards/task/main';
import { Order } from '@/enums/sort';
import { sortArray } from '@/utilities/helpers/array';

export default function Tasks() {
  const { category, filteredTasks } = useTabAside();
  const { createTask } = useTaskActions();

  return (
    <div>
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
                <CardTaskMain item={ft} />
              </React.Fragment>
            )
          )
        )}
      </Stack>
    </div>
  );
}
