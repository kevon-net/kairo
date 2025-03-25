'use client';

import React from 'react';

import { Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import FormContact from '@/components/form/contact';
import { usePathname } from 'next/navigation';
import { BASE_URL } from '@/data/constants';
import LayoutModal from '@/components/layout/modal';

export default function Support({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        size={'xl'}
        padding={'xl'}
      >
        <LayoutModal
          props={{
            title: 'Contact Support',
            close,
          }}
        >
          <Stack>
            <Text ta={{ base: 'center', xs: 'start' }}>
              Leave your email and we will get back to you within 24 hours.
            </Text>

            <FormContact
              props={{
                subject: 'Technical Support',
                message: `I just got an error at ${BASE_URL}${pathname}`,
              }}
              options={{ modal: true, close }}
            />
          </Stack>
        </LayoutModal>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
