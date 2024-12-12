'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { SessionGet } from '@repo/types/models';
import { Modal, Button, Stack, Text, ActionIcon, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import LayoutModal from '@/components/layout/modal';
import { Alert } from '@repo/enums';

export default function Session({ props }: { props: SessionGet }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    close();
  };

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
            title: 'Delete Session',
            close,
          }}
          variant={Alert.WARNING}
        >
          <Stack>
            <Text ta={{ base: 'center', xs: 'start' }}>
              Are you sure? Deleting your session will sign you out of (
              <Text component="span" inherit fw={'bold'}>
                {props.ip}
              </Text>
              ).
            </Text>

            <Flex justify={{ base: 'center', xs: 'end' }} gap={'xs'}>
              <Button color="yellow" onClick={handleDelete}>
                Delete
              </Button>
            </Flex>
          </Stack>
        </LayoutModal>
      </Modal>

      <ActionIcon size={ICON_WRAPPER_SIZE} color="red" onClick={open}>
        <IconLogout size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </>
  );
}
