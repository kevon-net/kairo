'use client';

import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
import { SessionGet } from '@/types/models/session';
import { Modal, Button, Stack, Text, ActionIcon, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';

export default function Session({ props }: { props: SessionGet }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = () => {
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Delete Session">
        <Stack>
          <Text>
            Are you sure? Deleting your session will sign you out of (
            <Text component="span" inherit fw={'bold'}>
              {props.ip}
            </Text>
            ).
          </Text>

          <Group justify="end">
            <Button variant="light" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <ActionIcon
        size={iconWrapperSize}
        color="red"
        variant="light"
        onClick={open}
      >
        <IconLogout size={iconSize} stroke={iconStrokeWidth} />
      </ActionIcon>
    </>
  );
}
