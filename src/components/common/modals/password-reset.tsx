'use client';

import React from 'react';

import { Modal, Button, Stack, Text, Group, Anchor } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSignOut } from '@/hooks/auth';
import { authUrls } from '@/data/constants';

export default function PasswordReset({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { signOut, loading } = useSignOut(authUrls.passwordForgot);

  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Reset Password">
        <Stack>
          <Text>
            You&apos;ll be signed out and redirected to the password reset page.
          </Text>

          <Group justify="end">
            <Button color="yellow" onClick={signOut} loading={loading}>
              Sign Out and Redirect
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Anchor component="span" inherit onClick={open}>
        {children}
      </Anchor>
    </>
  );
}
