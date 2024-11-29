'use client';

import React from 'react';

import { Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import FormContact from '@/components/form/contact';
import { usePathname } from 'next/navigation';
import { baseUrl } from '@/data/constants';

export default function Support({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Contact Support"
        size={'xl'}
      >
        <Stack>
          <Text>
            Leave your email and we will get back to you within 24 hours.
          </Text>

          <FormContact
            props={{
              subject: '404 Error',
              message: `Hi, I just got a 404 error at ${baseUrl}${pathname}`,
            }}
            options={{ modal: true }}
          />
        </Stack>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
