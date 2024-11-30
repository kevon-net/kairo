'use client';

import { Modal, Button, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import FormUserAccountDelete from '@/components/form/user/account/delete';
import LayoutModal from '@/components/layout/modal';
import { Alert } from '@/types/enums';

export default function Account() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        size={'lg'}
        padding={'xl'}
      >
        <LayoutModal
          props={{
            title: 'Account Erasure',
            close,
          }}
          variant={Alert.DANGER}
        >
          <Stack>
            <Text ta={{ base: 'center', xs: 'start' }}>
              Deleting your account will permanently remove all data associated
              with it.{' '}
              <Text component="span" inherit c="red">
                Proceed with caution. This action is irreversible.
              </Text>
            </Text>

            <FormUserAccountDelete close={close} />
          </Stack>
        </LayoutModal>
      </Modal>

      <Button color="red" onClick={open}>
        Delete Account
      </Button>
    </>
  );
}
