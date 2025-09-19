'use client';

import React from 'react';

import { Button, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LayoutModalMain from '@/components/layout/modal/main';
import { showNotification } from '@/utilities/notifications';
import { Alert, Variant } from '@/enums/notification';
import { IconInfoSmall } from '@tabler/icons-react';

export default function Confirm({
  children,
  props,
}: {
  children: React.ReactNode;
  props: {
    title?: string;
    desc?: string;
    actions: {
      onCancel?: () => void;
      onConfirm: () => void;
    };
  };
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleCancel = () => {
    if (props.actions.onCancel) props.actions.onCancel();
    close();
    showNotification({
      variant: Variant.INFO,
      icon: IconInfoSmall,
      title: 'Canceled',
      desc: 'The action has been canceled.',
    });
  };

  const handleConfirm = () => {
    props.actions.onConfirm();
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} centered withCloseButton={false}>
        <LayoutModalMain
          props={{ title: props.title || 'Confirm Delete' }}
          variant={Alert.WARNING}
        >
          <div>
            <Text>
              {props.desc || 'Are you sure you want to delete this note?'}
            </Text>

            <Group justify="end" mt={'xl'}>
              <Button onClick={handleCancel} variant="light" color="gray.6">
                Cancel
              </Button>

              <Button onClick={handleConfirm}>Confirm</Button>
            </Group>
          </div>
        </LayoutModalMain>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
