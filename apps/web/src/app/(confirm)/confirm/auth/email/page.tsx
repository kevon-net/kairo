'use client';

import React from 'react';

// import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intro/page';
import { Button, Center, Group, Loader, ThemeIcon } from '@mantine/core';
import { useFormAuthVerifyEmail } from '@/hooks/form/auth/verify-email';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { IconCheck, IconX } from '@tabler/icons-react';

// export const metadata: Metadata = { title: 'Confirm Email' };

export default function ConfirmEmail() {
  const { status, handleSubmit } = useFormAuthVerifyEmail();

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Email Verification`,
          title:
            !status?.status || status.status == 'loading'
              ? 'Verifying Email'
              : status.status == 'error'
                ? 'Email Verified'
                : 'Verify Email',
          desc:
            !status?.status || status?.status == 'loading'
              ? 'Please wait while we verify your email...'
              : status.message,
        }}
      />

      <Group justify="center">
        {!status?.status ? (
          <Button onClick={handleSubmit}>Verify Email</Button>
        ) : status?.status == 'loading' ? (
          <Center h={ICON_WRAPPER_SIZE * 2}>
            <Loader type="dots" size={40} />
          </Center>
        ) : status?.status == 'error' ? (
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
