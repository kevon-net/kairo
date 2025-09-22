'use client';

import React from 'react';
import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import {
  COOKIE_NAME,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@/data/constants';
import { setCookieClient } from '@/utilities/helpers/cookie-client';
import {
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
  IconLayoutSidebarRight,
  IconLayoutSidebarRightFilled,
} from '@tabler/icons-react';
import { AppShell } from '@/types/components/app-shell';

export default function Main() {
  const appShell = useAppSelector((state) => state.appShell.value);
  const dispatch = useAppDispatch();

  const states = {
    iconLeft: !appShell?.child.navbar
      ? IconLayoutSidebar
      : IconLayoutSidebarFilled,
    iconRight: !appShell?.child.aside
      ? IconLayoutSidebarRight
      : IconLayoutSidebarRightFilled,
  };

  const handleAppshellChange = (params: AppShell) => {
    if (!appShell) return;

    dispatch(updateAppShell(params));

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  return (
    <Group justify="space-between">
      <Group p={'xs'}>
        {appShell == null ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : (
          <Tooltip
            label={appShell.child.navbar ? 'Collapse' : 'Expand'}
            position="right"
          >
            <ActionIcon
              variant="subtle"
              color="pri.5"
              aria-label={appShell.child.navbar ? 'Collapse' : 'Expand'}
              onClick={() =>
                handleAppshellChange({
                  ...appShell,
                  child: {
                    ...appShell.child,
                    navbar: !appShell?.child.navbar,
                  },
                })
              }
              size={ICON_WRAPPER_SIZE}
            >
              <states.iconLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Group justify="end" p={'xs'}>
        {appShell == null ? (
          <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
        ) : (
          <Tooltip
            label={appShell.child.aside ? 'Collapse' : 'Expand'}
            position="left"
          >
            <ActionIcon
              variant="subtle"
              color="pri.5"
              aria-label={appShell.child.aside ? 'Collapse' : 'Expand'}
              onClick={() =>
                handleAppshellChange({
                  ...appShell,
                  child: {
                    ...appShell.child,
                    aside: !appShell?.child.aside,
                  },
                })
              }
              size={ICON_WRAPPER_SIZE}
            >
              <states.iconRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
}
