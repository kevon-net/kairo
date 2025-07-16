'use client';

import React, { useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  Modal,
  Overlay,
  ScrollArea,
  ScrollAreaAutosize,
  Text,
} from '@mantine/core';
import { navLinks } from '@/components/layout/navbars/app/main';
import {
  APPSHELL,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  MODAL_HEIGHT,
} from '@/data/constants';
import { IconCell, IconX } from '@tabler/icons-react';
import FormSessionProperties from '@/components/form/session/properties';
import FormSessionView from '@/components/form/session/view';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSelectedSession } from '@/libraries/redux/slices/sessions';
import { useFormSession } from '@/hooks/form/session';
import IndicatorNetworkStatus from '@/components/indicators/network-status';
import { useMediaQuery, useResizeObserver } from '@mantine/hooks';
import { SyncStatus } from '@generated/prisma';

export default function View({ children }: { children: React.ReactNode }) {
  const syncStatus = useAppSelector((state) => state.syncStatus.value);
  const selectedSession = useAppSelector(
    (state) => state.sessions.selectedSession
  );

  const sessions = useAppSelector((state) => state.sessions.value);
  const session = useMemo(
    () => sessions?.find((t) => t.id == selectedSession?.id),
    [sessions, selectedSession?.id]
  );

  const categories = useAppSelector((state) => state.categories.value);
  const category = useMemo(
    () => categories?.find((c) => c.id == session?.category_id),
    [categories, session?.category_id]
  );

  const dispatch = useAppDispatch();

  const close = () => {
    if (form.isDirty('title') || form.isDirty('description')) {
      const wrapperElement = document.getElementById(wrapperId);
      wrapperElement?.click();
    } else {
      dispatch(updateSelectedSession(null));
    }
  };

  const pathname = usePathname();
  const navlink = navLinks.find((link) => link.link == pathname);

  const { form, submitted, handleDelete, handleSubmit, updateState } =
    useFormSession();

  const [focused, setFocused] = useState(false);

  const mobile = useMediaQuery('(min-width: 36em)');
  const tablet = useMediaQuery('(min-width: 48em)');

  const [refHeader, header] = useResizeObserver();
  const [refProperties, properties] = useResizeObserver();

  const col1 = (
    <Group gap={'xs'} wrap="nowrap" p={'md'} align="start">
      <FormSessionView
        props={{
          form,
          submitted,
          handleSubmit,
          updateState,
          wrapperId,
          setFocused,
        }}
      />
    </Group>
  );

  const col2 = (
    <FormSessionProperties
      props={{
        form,
        handleDelete,
        submitted,
        handleSubmit,
        id: session?.id,
        parentModalstate: {
          opened: !!selectedSession,
          close,
        },
      }}
    />
  );

  return (
    <>
      <Modal
        opened={!!selectedSession}
        onClose={close}
        withCloseButton={false}
        centered
        fullScreen={!mobile}
        size={'xl'}
        padding={0}
        pos={'relative'}
      >
        <Box
          pos={'sticky'}
          top={0}
          bg={'var(--mantine-color-body)'}
          style={{ zIndex: 10 }}
          ref={refHeader}
        >
          <Group justify="space-between" p={'sm'}>
            <Group gap={5}>
              {navlink ? (
                <navlink.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              ) : (
                <IconCell size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              )}

              <Text component="span" inherit fz={'sm'} fw={500} lineClamp={1}>
                {navlink?.label || category?.title || session?.title}
              </Text>
            </Group>

            <Group gap={'xs'}>
              <IndicatorNetworkStatus
                props={{
                  itemSyncStatus:
                    syncStatus == SyncStatus.SAVED ||
                    syncStatus == SyncStatus.SYNCED
                      ? syncStatus
                      : session?.sync_status,
                }}
              />

              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="gray"
                variant="subtle"
                onClick={() => dispatch(updateSelectedSession(null))}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </Group>

          <Divider />
        </Box>

        <Grid gutter={0}>
          <GridCol span={{ base: 12, sm: 7.5, md: 8 }}>
            <div
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              {tablet ? (
                <ScrollAreaAutosize
                  type="auto"
                  scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
                  h={MODAL_HEIGHT.SESSION_VIEW}
                  scrollbars={'y'}
                >
                  {col1}
                </ScrollAreaAutosize>
              ) : (
                <div
                  style={{
                    minHeight: `calc(100vh - (${header.height}px + ${properties.height}px))`,
                  }}
                >
                  {col1}
                </div>
              )}
            </div>
          </GridCol>

          <GridCol
            span={{ base: 12, sm: 4.5, md: 4 }}
            bg={
              'light-dark(var(--mantine-color-gray-0),var(--mantine-color-dark-7))'
            }
            pos={'relative'}
          >
            {
              <ScrollArea
                type="auto"
                scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
                h={{ base: '100%', sm: MODAL_HEIGHT.SESSION_VIEW }}
                scrollbars={'y'}
                pos={'relative'}
                ref={refProperties}
              >
                {col2}
              </ScrollArea>
            }

            {focused && <Overlay backgroundOpacity={0.4} />}
          </GridCol>
        </Grid>
      </Modal>

      <div>{children}</div>
    </>
  );
}

const wrapperId = 'sessionViewPrompt';
