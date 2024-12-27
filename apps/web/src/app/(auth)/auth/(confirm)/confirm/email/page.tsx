'use client';

import React from 'react';

// import { Metadata } from 'next';

import { Button, Center, Group, Loader, ThemeIcon } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intro/page';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useFormAuthConfirmEmail } from '@/hooks/form/auth/confirm';

// export const metadata: Metadata = { title: 'Delete Account' };

export default function Email() {
  const { status, handleTrigger } = useFormAuthConfirmEmail();

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Verify Email`,
          title: !status.state
            ? `Confirm Sign Up`
            : status.state == 'loading'
              ? 'Processing Request'
              : `Request ${status.state == 'error' ? 'Failed' : 'Confirmed'}`,
          desc: status.message,
        }}
      />

      <Group justify="center">
        {!status.state ? (
          <Group h={ICON_WRAPPER_SIZE * 2} justify="center">
            <Button onClick={handleTrigger}>Verify Email</Button>
          </Group>
        ) : status.state == 'loading' ? (
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
