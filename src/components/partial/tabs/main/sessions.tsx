'use client';

import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { useTabAside } from '@/hooks/tab/navbar';
import { capitalizeWords } from '@/utilities/formatters/string';
import CardSessionMain from '@/components/common/cards/session/main';
import { Order } from '@/enums/sort';
import { sortArray } from '@/utilities/helpers/array';
import { useAppSelector } from '@/hooks/redux';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { useSessionTimer } from '@/components/contexts/session-timer';
import { SessionType } from '@generated/prisma';
import { groupByDay } from '@/services/logic/time';
import { prependZeros, secToHourMinSec } from '@/utilities/formatters/number';
import { getRegionalDate } from '@/utilities/formatters/date';

export default function Sessions() {
  const { category, filteredSessions } = useTabAside();

  const sessions = useAppSelector((state) => state.sessions.value);
  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { startPhase } = usePomo();
  const { startTimer } = useSessionTimer();

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
              Start new session
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

                      <CardSessionMain item={sfs} />
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
