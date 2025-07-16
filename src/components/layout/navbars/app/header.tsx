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
import {
  ActionIcon,
  Box,
  Group,
  NavLink,
  Skeleton,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import {
  IconLayoutSidebar,
  IconLayoutSidebarFilled,
  IconPlus,
} from '@tabler/icons-react';
import React from 'react';
import ModalSessionCreate from '@/components/common/modals/session/create';
import { navLinkStyles } from './main';
import MenuUser from '@/components/common/menus/user';
import { setCookieClient } from '@/utilities/helpers/cookie-client';

export default function Header() {
  const appShell = useAppSelector((state) => state.appShell.value);
  const session = useAppSelector((state) => state.session.value);
  const dispatch = useAppDispatch();

  return (
    <Stack gap={'xs'} py={'xs'} px={APPSHELL.PADDING}>
      <Group
        px={`${APPSHELL.PADDING_OFFSET}`}
        mih={ICON_WRAPPER_SIZE * 1.25}
        justify="space-between"
      >
        {session == undefined && <Skeleton w={28} h={28} radius={'50%'} />}
        {session == null && <Box w={28} h={28}></Box>}
        {session && <MenuUser />}

        <Group gap={'xs'}>
          {appShell == null ? (
            <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
          ) : (
            <ActionIcon
              variant="subtle"
              color="pri.5"
              aria-label={appShell.navbar ? 'Collapse' : 'Expand'}
              onClick={() => {
                dispatch(
                  updateAppShell({ ...appShell, navbar: !appShell.navbar })
                );

                setCookieClient(
                  COOKIE_NAME.APP_SHELL.NAVBAR,
                  !appShell.navbar,
                  { expiryInSeconds: WEEK }
                );
              }}
              size={ICON_WRAPPER_SIZE}
            >
              {appShell.navbar ? (
                <IconLayoutSidebar
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              ) : (
                <IconLayoutSidebarFilled
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              )}
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Stack gap={'xs'}>
        <ModalSessionCreate>
          <NavLink
            label="New Session"
            leftSection={
              <ThemeIcon size={ICON_SIZE} color="pri">
                <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            }
            style={navLinkStyles}
          />
        </ModalSessionCreate>
      </Stack>
    </Stack>
  );
}
