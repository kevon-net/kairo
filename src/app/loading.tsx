import React from 'react';
import ProviderMantine from '@/components/providers/mantine';
import LoaderApp from '@/components/common/loaders/app';
import { Stack } from '@mantine/core';

export default function Loading() {
  return (
    <ProviderMantine>
      <Stack h={'100vh'} align="center" justify="center">
        <LoaderApp />
      </Stack>
    </ProviderMantine>
  );
}
