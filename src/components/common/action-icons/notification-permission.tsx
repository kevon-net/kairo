'use client';

import { ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@/data/constants';
import { useNotificationPermission } from '@/hooks/notifications';
import { useAppSelector } from '@/hooks/redux';
import { ActionIcon, Button, Group, Skeleton, Transition } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconNotification } from '@tabler/icons-react';
import React from 'react';

export default function NotificationPermission() {
  const { isGranted, requestPermission } = useNotificationPermission();
  const tasks = useAppSelector((state) => state.tasks.value);
  const mobile = useMediaQuery('(max-width: 36em)');

  const notificationIcon = (
    <IconNotification
      size={ICON_WRAPPER_SIZE / 1.25}
      stroke={ICON_STROKE_WIDTH}
    />
  );

  return tasks == null ? (
    <Skeleton w={148} h={28} />
  ) : (
    <Transition
      mounted={!isGranted}
      transition="fade"
      exitDelay={3000}
      enterDelay={3000}
      timingFunction="ease"
    >
      {(styles) => (
        <Group style={styles}>
          {mobile ? (
            <ActionIcon size={28} variant="subtle">
              {notificationIcon}
            </ActionIcon>
          ) : (
            <Button
              id="notification-permission"
              variant="subtle"
              size="xs"
              leftSection={notificationIcon}
              onClick={requestPermission}
            >
              Enable Notifications
            </Button>
          )}
        </Group>
      )}
    </Transition>
  );
}
