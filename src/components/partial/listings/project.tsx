'use client';

import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Stack, Transition } from '@mantine/core';
import { useSessionActions } from '@/hooks/actions/sessions';
import CardSessionTimer from '@/components/common/cards/session/timer';
import CardSessionStopwatch from '@/components/common/cards/session/stopwatch';
import { useAppSelector } from '@/hooks/redux';
import { useTabAside } from '@/hooks/tab/navbar';
import TabCategory from '@/components/common/tabs/category';

export default function Project() {
  const appShell = useAppSelector((state) => state.appShell.value);
  const timerMode = useAppSelector((state) => state.timerMode.value);

  const { sessions, categories } = useSessionActions();
  const { category, filteredSessions } = useTabAside();

  const asideChildclosed = appShell && appShell.child.aside == false;

  return (
    <Container
      p={{ md: SECTION_SPACING }}
      py={SECTION_SPACING / 2}
      h={
        asideChildclosed && filteredSessions?.length
          ? undefined
          : 'calc(100vh - 55px)'
      }
    >
      {sessions == null || categories == null ? (
        'loading ui goes here' // Avoid rendering mismatched DOM before hydration
      ) : !category ? (
        <PlaceholderEmpty
          props={{
            title: 'Project not found',
            desc: "The project doesn't seem to exist.",
          }}
        />
      ) : (
        <Stack
          h={'100%'}
          justify={
            asideChildclosed && filteredSessions?.length ? undefined : 'center'
          }
        >
          {timerMode != null && (
            <>
              {timerMode.mode == 'timer' && (
                <CardSessionTimer props={{ categoryId: category.id }} />
              )}

              {timerMode.mode == 'stopwatch' && (
                <CardSessionStopwatch props={{ categoryId: category.id }} />
              )}
            </>
          )}

          <Transition mounted={!!asideChildclosed}>
            {(styles) => (
              <div style={styles}>
                <TabCategory />
              </div>
            )}
          </Transition>
        </Stack>
      )}
    </Container>
  );
}
