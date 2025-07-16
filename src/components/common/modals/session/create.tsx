'use client';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import {
  OptionalFormSessionValues,
  useFormSession,
} from '@/hooks/form/session';
import PartialSessionCreate from '@/components/partial/session/create';

export default function Create({
  props,
  children,
}: {
  props?: { defaultValues?: OptionalFormSessionValues };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { form, handleSubmit, addSessionToState, submitted } = useFormSession({
    defaultValues: props?.defaultValues,
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          if (form.isDirty()) {
            const wrapperElement = document.getElementById(wrapperId);
            wrapperElement?.click();
          } else {
            handleClose();
          }
        }}
        withCloseButton={false}
        size={'lg'}
        centered
        padding={0}
        styles={{
          content: { overflow: 'visible' },
        }}
      >
        <PartialSessionCreate
          props={{
            form,
            opened,
            handleClose,
            submitted,
            handleSubmit,
            addSessionToState,
          }}
        />
      </Modal>

      <div onClick={open}>{children}</div>
    </>
  );
}

const wrapperId = 'sessionCreatePrompt';
