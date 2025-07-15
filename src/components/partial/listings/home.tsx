'use client';

import React from 'react';
import { SECTION_SPACING } from '@/data/constants';
import { Container, Group, Skeleton, Stack, Title } from '@mantine/core';
import { useAppSelector } from '@/hooks/redux';
import { getTimeOfDay } from '@/utilities/helpers/time';
import { capitalizeWords } from '@/utilities/formatters/string';

export default function Home() {
  const session = useAppSelector((state) => state.session.value);

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      <Stack gap={SECTION_SPACING / 2}>
        {session == null ? (
          <Group justify="center">
            <Skeleton height={26} width={260} />
          </Group>
        ) : (
          <Title order={1} fz={'xl'} fw={500} ta={'center'}>
            Good {getTimeOfDay()},{' '}
            {capitalizeWords(session?.user_metadata.name)}
          </Title>
        )}

        <div>timer</div>
      </Stack>
    </Container>
  );
}
