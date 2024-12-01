'use client';

import React from 'react';

// import { Metadata } from 'next';

import { Center, Group, Loader, ThemeIcon } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intro/page';

import { useFormUserAccountDeleteTrigger } from '@/hooks/form/account/delete/trigger';
import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
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
          <Center h={iconWrapperSize * 2}>
            <Loader type="dots" size={40} />
          </Center>
        ) : status.state == 'error' ? (
          <ThemeIcon size={iconWrapperSize * 2} color="red" radius={999}>
            <IconX size={iconSize * 2} stroke={iconStrokeWidth} />
          </ThemeIcon>
        ) : (
          <ThemeIcon size={iconWrapperSize * 2} color="green" radius={999}>
            <IconCheck size={iconSize * 2} stroke={iconStrokeWidth} />
          </ThemeIcon>
        )}
      </Group>
    </LayoutPage>
  );
}
