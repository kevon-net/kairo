'use client';

import React from 'react';
import PlaceholderEmpty from '@/components/placeholder/empty';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Stack } from '@mantine/core';
import { useSessionActions } from '@/hooks/actions/sessions';
import CardSessionLive from '@/components/common/cards/session/live';
import { useAppSelector } from '@/hooks/redux';
import { useTabAside } from '@/hooks/tab/navbar';
import TabCategory from '@/components/common/tabs/category';

export default function Project() {
  const appShell = useAppSelector((state) => state.appShell.value);

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
          <CardSessionLive props={{ categoryId: category.id }} />

          {asideChildclosed && <TabCategory />}
        </Stack>
      )}
    </Container>
  );
}
