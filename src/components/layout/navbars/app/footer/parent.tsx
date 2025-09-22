'use client';

import React from 'react';
import { Group, Stack } from '@mantine/core';
import MenuUser from '@/components/common/menus/user';
import { useAppSelector } from '@/hooks/redux';
import IndicatorNetworkStatus from '@/components/indicators/network-status';
// import ControlTheme from '@/components/common/segmented-control/theme';

export default function Parent() {
  const session = useAppSelector((state) => state.session.value);

  return (
    <Stack p={'xs'} align="center">
      <IndicatorNetworkStatus />

      {/* <IconNotificationPermission /> */}

      {/* <ControlTheme /> */}

      {session && (
        <Group>
          <MenuUser />
        </Group>
      )}
    </Stack>
  );
}
