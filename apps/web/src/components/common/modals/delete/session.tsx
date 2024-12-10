'use client';

import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
import { SessionGet } from '@/types/models/session';
import { Modal, Button, Stack, Text, ActionIcon, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import LayoutModal from '@/components/layout/modal';
import { Alert } from '@/enums/notification';

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

      <ActionIcon size={iconWrapperSize} color="red" onClick={open}>
        <IconLogout size={iconSize} stroke={iconStrokeWidth} />
      </ActionIcon>
    </>
  );
}
