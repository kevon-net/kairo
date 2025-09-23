'use client';

import {
  COOKIE_NAME,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@/data/constants';
import { ActionIcon, Skeleton, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconClockPlus,
  IconHome,
  IconInputSearch,
  IconStopwatch,
  IconTerminal,
  IconTimeDuration5,
  IconTimeline,
} from '@tabler/icons-react';
import React from 'react';
import SpotlightSearch from '@/components/spotlights/search';
import SpotlightCommands from '@/components/spotlights/commands';
import { usePomo } from '@/components/contexts/pomo-cycles';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { AppShell } from '@/types/components/app-shell';
import { updateAppShell } from '@/libraries/redux/slices/app-shell';
import { setCookieClient } from '@/utilities/helpers/cookie-client';
import { useTimerMode } from '@/hooks/actions/timer-mode';

export default function Main() {
  const sessions = useAppSelector((state) => state.sessions.value);
  const categories = useAppSelector((state) => state.categories.value);

  const { startPhase, session } = usePomo();
  const pathname = usePathname();
  const router = useRouter();
  const appHomePath = '/app/home';

  const appShell = useAppSelector((state) => state.appShell.value);
  const dispatch = useAppDispatch();

  const handleAppshellChange = (params: AppShell) => {
    if (!appShell) return;

    dispatch(updateAppShell(params));

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  const { timerMode, toogleTimerMode } = useTimerMode();

  const timerModeProps = {
    icon: timerMode?.mode == 'stopwatch' ? IconStopwatch : IconTimeDuration5,
    tooltip: timerMode?.mode == 'stopwatch' ? 'Pomodoro' : 'Logging',
    label: timerMode?.mode == 'stopwatch' ? 'Logging' : 'Pomodoro',
  };

  return (
    <Stack p={`xs`} gap={5}>
      <Tooltip label={'Go to app home page'} position={'right'}>
        <ActionIcon
          variant="subtle"
          size={ICON_WRAPPER_SIZE}
          component={Link}
          href={appHomePath}
        >
          <IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>

      {sessions == null ? (
        <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
      ) : (
        <Tooltip label={'Start quick session'} position={'right'}>
          <ActionIcon
            variant="subtle"
            size={ICON_WRAPPER_SIZE}
            disabled={!!session}
            onClick={() => {
              if (pathname != appHomePath) router.push(appHomePath);
              startPhase();
            }}
          >
            <IconClockPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      )}

      <Tooltip
        label={'See full timeline'}
        position={'right'}
        onClick={() => {
          if (appShell == null) return;

          if (pathname != appHomePath) router.push(appHomePath);

          if (appShell.child.aside == true) {
            // shift focus to child aside
          } else {
            handleAppshellChange({
              ...appShell,
              child: { ...appShell.child, aside: true },
            });
          }
        }}
      >
        <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
          <IconTimeline size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>

      {categories == null ? (
        <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
      ) : (
        <SpotlightSearch>
          <Tooltip label={'Open project finder'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconInputSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </SpotlightSearch>
      )}

      {categories == null || sessions == null ? (
        <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
      ) : (
        <SpotlightCommands>
          <Tooltip label={'Open command palette'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </SpotlightCommands>
      )}

      {timerMode == null ? (
        <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
      ) : (
        <Tooltip
          label={
            <Text component="span" inherit>
              <span>Current timer mode: {timerModeProps.label}</span>
              <br />
              <span>Switch to {timerModeProps.tooltip}</span>
            </Text>
          }
          multiline
          maw={240}
          ta={'center'}
          position={'right'}
          onClick={toogleTimerMode}
        >
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <timerModeProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      )}
    </Stack>
  );
}
