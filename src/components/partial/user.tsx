'use client';

import React from 'react';

import { Flex, Stack, Text, Title } from '@mantine/core';

import AvatarMain from '@/components/common/avatars/main';
import { useAppSelector } from '@/hooks/redux';

export default function User() {
  const session = useAppSelector((state) => state.session.value);

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      align={'center'}
      justify={'center'}
      gap={'md'}
      w={'100%'}
    >
      <AvatarMain />

      {session && (
        <Stack gap={0}>
          <Title order={3} fz={'md'} ta={{ base: 'center', lg: 'start' }}>
            {session.user_metadata.name}
          </Title>

          <Text fz={'xs'} c={'dimmed'} ta={{ base: 'center', lg: 'start' }}>
            {session.email}
          </Text>
        </Stack>
      )}
    </Flex>
  );
}
