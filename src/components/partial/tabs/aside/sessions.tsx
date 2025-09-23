'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import {
  Box,
  Button,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardSessionAside from '@/components/common/cards/session/aside';
import { Order } from '@/enums/sort';
import { sortArray } from '@/utilities/helpers/array';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { SessionType } from '@generated/prisma';
import { useAppSelector } from '@/hooks/redux';
import { useSessionTimer } from '@/components/contexts/session-timer';
import { groupByDay } from '@/services/logic/time';
import { getRegionalDate } from '@/utilities/formatters/date';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';

export default function Sessions() {
  const { category, filteredSessions } = useTabAside();

  const sessions = useAppSelector((state) => state.sessions.value);
  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { session: sessionPomo, startPhase } = usePomo();
  const { session: sessionStopwatch, startTimer } = useSessionTimer();

  const sortedFilteredSessions = sortArray(
    filteredSessions,
    (i) => i.created_at,
    Order.DESCENDING
  );

  const handleCreateSession = () => {
    if (timerMode == null) return;

    if (timerMode.mode == 'timer') {
      startPhase({ values: { category_id: category?.id } });
    }

    if (timerMode.mode == 'stopwatch') {
      startTimer({ type: SessionType.STOPWATCH, category_id: category?.id });
    }
  };

  const sessionGroups = groupByDay(
    sortedFilteredSessions,
    (fs) => new Date(fs.created_at)
  );

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
                disabled={!!sessionPomo || !!sessionStopwatch}
                leftSection={
                  <IconPlus size={ICON_SIZE - 2} stroke={ICON_STROKE_WIDTH} />
                }
                onClick={handleCreateSession}
              >
                Start new session
              </Button>
            )}
          </Group>
        </Box>
      )}

      <Stack gap={'xl'} pb={'xs'}>
        {sessions == null ? (
          <>skeletons</>
        ) : filteredSessions.length == 0 ? (
          <PlaceholderEmpty
            props={{
              title: `No Sessions Found`,
              desc: `Add ${capitalizeWords(category?.title || '')} sessions to get started`,
            }}
          >
            <Button size="xs" onClick={handleCreateSession}>
              Add session
            </Button>
          </PlaceholderEmpty>
        ) : (
          sessionGroups.map((sg, i) => {
            let totalElapsed = 0;
            sg.items.map((sgi) => (totalElapsed += sgi.elapsed));
            const hourMinSec = secToHourMinSec(totalElapsed);

            return (
              <Stack key={i} gap={'md'}>
                <div>
                  <Group justify="space-between">
                    <Title order={2} fz={'md'} fw={500}>
                      {getRegionalDate(sg.day).date}
                    </Title>

                    <Text inherit c={'dimmed'} fz={'sm'} ta={'end'} fw={500}>
                      {prependZeros(Number(hourMinSec?.hours || 0), 2)}:
                      {prependZeros(Number(hourMinSec?.minutes || 0), 2)}:
                      {prependZeros(Number(hourMinSec?.seconds || 0), 2)}
                    </Text>
                  </Group>

                  <Divider mt={'xs'} variant="dashed" />
                </div>

                <div>
                  {sortedFilteredSessions.map((sfs, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <Divider
                          mt={
                            sortedFilteredSessions[i - 1].type !=
                            SessionType.STOPWATCH
                              ? 15
                              : 5
                          }
                          mb={10}
                        />
                      )}

                      <CardSessionAside item={sfs} />
                    </React.Fragment>
                  ))}
                </div>
              </Stack>
            );
          })
        )}
      </Stack>
    </div>
  );
}
