'use client';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { OptionalFormTaskValues, useFormTask } from '@/hooks/form/task';
import PartialTaskCreate from '@/components/partial/task/create';

export default function Create({
  props,
  children,
}: {
  props?: { defaultValues?: OptionalFormTaskValues };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const { form, handleSubmit, addTaskToState, submitted } = useFormTask({
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
        <PartialTaskCreate
          props={{
            form,
            opened,
            handleClose,
            submitted,
            handleSubmit,
            addTaskToState,
          }}
        />
      </Modal>

      <div onClick={open}>{children}</div>
    </>
  );
}

const wrapperId = 'taskCreatePrompt';
