import LoaderApp from '@/components/common/loaders/app';
import { Stack } from '@mantine/core';

export default function Loading() {
  return (
    <Stack h={'100vh'} align="center" justify="center">
      <LoaderApp />
    </Stack>
  );
}
