'use client';

import React from 'react';

import { Modal, Button, Stack, Text, Anchor, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSignOut } from '@/hooks/auth';
import { AUTH_URLS } from '@/data/constants';
import LayoutModal from '@/components/layout/modal';
import { Alert } from '@repo/enums';

export default function PasswordReset({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { signOut, loading } = useSignOut(AUTH_URLS.PASSWORD_FORGOT, close);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        padding={'xl'}
      >
        <LayoutModal
          props={{
            title: 'Reset Password',
            close,
          }}
          variant={Alert.WARNING}
        >
          <Stack>
            <Text ta={{ base: 'center', xs: 'start' }}>
              You&apos;ll be signed out and redirected to the password reset
              page.
            </Text>

            <Flex justify={{ base: 'center', xs: 'end' }} gap={'xs'}>
              <Button color="yellow" onClick={signOut} loading={loading}>
                Reset
              </Button>
            </Flex>
          </Stack>
        </LayoutModal>
      </Modal>

      <Anchor component="span" inherit onClick={open}>
        {children}
      </Anchor>
    </>
  );
}
