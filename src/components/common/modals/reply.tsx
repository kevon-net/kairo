'use client';

import React from 'react';

import { Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LayoutModalMain from '@/components/layout/modal/main';
import FormBlogReply from '@/components/form/blog/reply';

export default function Reply({
  children,
  props,
}: {
  children: React.ReactNode;
  props: { name: string; replyId?: string; commentId?: string };
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        padding={'xl'}
        size={'lg'}
      >
        <LayoutModalMain props={{ title: `Reply to ${props.name}`, close }}>
          <Stack>
            <Text>Your email address will not be published.</Text>

            <FormBlogReply
              commentId={props.commentId}
              replyId={props.replyId}
              close={close}
            />
          </Stack>
        </LayoutModalMain>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
