'use client';

import {
  APPSHELL,
  COOKIE_NAME,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@/data/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { ActionIcon, Button, Group, Skeleton, Text } from '@mantine/core';
import { IconLayout, IconLayoutSidebarFilled } from '@tabler/icons-react';
import React from 'react';
import LayoutSection from '../../section';
import classes from './content.module.scss';
import IndicatorNetworkStatus from '@/components/indicators/network-status';
import PopoverView from '@/components/common/popovers/view';
import IconNotificationPermission from '@/components/common/action-icons/notification-permission';
import { setCookieClient } from '@/utilities/helpers/cookie-client';
import { useMediaQuery } from '@mantine/hooks';

export default function Content() {
  const appShell = useAppSelector((state) => state.appShell.value);
  const dispatch = useAppDispatch();
  const mobile = useMediaQuery('(max-width: 36em)');

  const toogle = () => {
    if (!appShell) return;
    dispatch(updateAppShell({ ...appShell, navbar: !appShell.navbar }));
    setCookieClient(COOKIE_NAME.APP_SHELL.NAVBAR, !appShell.navbar, {
      expiryInSeconds: WEEK,
    });
  };

  const layoutIcon = <IconLayout size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />;

  return (
    <LayoutSection
      id="header-app-content"
      containerized={false}
      className={classes.header}
      p={APPSHELL.PADDING}
      pl={14}
    >
      <Group mih={ICON_WRAPPER_SIZE * 1.25} justify="space-between">
        <Group gap={'xs'}>
          {appShell == null ? (
            <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
          ) : (
            !appShell.navbar && (
              <ActionIcon
                aria-label={appShell.navbar ? 'Collapse' : 'Expand'}
                onClick={toogle}
                size={ICON_WRAPPER_SIZE}
                variant="subtle"
              >
                <IconLayoutSidebarFilled
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            )
          )}
        </Group>

        <Group gap={'xs'}>
          <IconNotificationPermission />

          <IndicatorNetworkStatus />

          <PopoverView>
            {mobile ? (
              <Group>
                <ActionIcon size={28} variant="subtle">
                  {layoutIcon}
                </ActionIcon>
              </Group>
            ) : (
              <Button variant="subtle" size="xs" leftSection={layoutIcon}>
                <Text component="span" inherit mt={2}>
                  View
                </Text>
              </Button>
            )}
          </PopoverView>
        </Group>
      </Group>
    </LayoutSection>
  );
}
