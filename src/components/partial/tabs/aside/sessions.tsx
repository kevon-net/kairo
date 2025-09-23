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
import { useSessionActions } from '@/hooks/actions/sessions';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardSessionAside from '@/components/common/cards/session/aside';
import { Order } from '@/enums/sort';
import { sortArray } from '@/utilities/helpers/array';

export default function Sessions() {
  const { category, filteredSessions } = useTabAside();
  const { createSession } = useSessionActions();

  return (
    <div>
      {filteredSessions.length > 0 && (
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
            {filteredSessions == null ? (
              <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
            ) : (
              <Button
                size="xs"
                leftSection={
                  <IconPlus size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                }
                onClick={() =>
                  createSession({ values: { category_id: category?.id } })
                }
              >
                Start new session
              </Button>
            )}
          </Group>
        </Box>
      )}

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

              <CardSessionAside item={ft} />
            </React.Fragment>
          ))
        )}
      </Stack>

      <div style={{ minHeight: '100vh' }}></div>
    </div>
  );
}
