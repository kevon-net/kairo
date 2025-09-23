'use client';

import { Button, Divider, Stack } from '@mantine/core';
import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useSessionActions } from '@/hooks/actions/sessions';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardSessionMain from '@/components/common/cards/session/main';
import { Order } from '@/enums/sort';
import { sortArray } from '@/utilities/helpers/array';

export default function Sessions() {
  const { category, filteredSessions } = useTabAside();
  const { createSession } = useSessionActions();

  return (
    <div>
      <Stack gap={'xs'} pb={'xs'}>
        {filteredSessions == null ? (
          <>skeletons</>
        ) : filteredSessions.length == 0 ? (
          <PlaceholderEmpty
            props={{
              title: `No Sessions Found`,
              desc: `Add ${capitalizeWords(category?.title || '')} sessions to get started`,
            }}
          >
            <Button
              size="xs"
              onClick={() =>
                createSession({ values: { category_id: category?.id } })
              }
            >
              Add session
            </Button>
          </PlaceholderEmpty>
        ) : (
          sortArray(
            filteredSessions,
            (i) => i.created_at,
            Order.DESCENDING
          ).map((ft, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider mt={3} />}

              <CardSessionMain item={ft} />
            </React.Fragment>
          ))
        )}
      </Stack>
    </div>
  );
}
