'use client';

import React from 'react';

// import { Metadata } from 'next';

import { Center, Group, Loader, ThemeIcon } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intro/page';

import { useFormUserAccountDeleteTrigger } from '@/hooks/form/account/delete/trigger';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { IconCheck, IconX } from '@tabler/icons-react';

// export const metadata: Metadata = { title: 'Delete Account' };

export default function DeleteAccount() {
  const { status } = useFormUserAccountDeleteTrigger();

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Account Deletion`,
          title:
            !status.state || status.state == 'loading'
              ? 'Processing Request'
              : `Request ${status.state == 'error' ? 'Failed' : 'Granted'}`,
          desc: `${status.message}.${status.state != 'success' ? '' : ' It will take 30 days to delete all your data. If you log into your account again within that time, the deletion process will be canceled.'}`,
        }}
      />

      <Group justify="center">
        {!status.state || status.state == 'loading' ? (
          <Center h={ICON_WRAPPER_SIZE * 2}>
            <Loader type="dots" size={40} />
          </Center>
        ) : status.state == 'error' ? (
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="red" radius={999}>
            <IconX size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        ) : (
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="green" radius={999}>
            <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        )}
      </Group>
    </LayoutPage>
  );
}
