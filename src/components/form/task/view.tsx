'use client';

import React from 'react';
import { Box, Button, Group, Text, Textarea, Transition } from '@mantine/core';
import classes from './view.module.scss';
import { FormTask } from '@/hooks/form/task';
import ModalPrompt from '@/components/common/modals/prompt';

export default function View({
  props,
}: {
  props: {
    form: FormTask;
    submitted: boolean;
    handleSubmit: (operation: () => void, reset?: boolean) => Promise<void>;
    updateState: () => void;
    wrapperId?: string;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) {
  return (
    <Box w={'100%'}>
      <Textarea
        w={'100%'}
        minRows={1}
        autosize
        placeholder="Task"
        variant="unstyled"
        key={props.form.key('title')}
        {...props.form.getInputProps('title')}
        classNames={{ input: classes.title }}
      />

      <Textarea
        w={'100%'}
        minRows={1}
        autosize
        placeholder="Add task description"
        variant="unstyled"
        key={props.form.key('description')}
        {...props.form.getInputProps('description')}
        classNames={{ input: classes.desc }}
      />

      <Transition
        mounted={
          props.form.isDirty('title') || props.form.isDirty('description')
        }
        transition="fade"
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <Group justify="end" gap={'xs'} mt={'md'}>
              <ModalPrompt
                props={{
                  title: 'Discard unsaved changes?',
                  color: 'red.6',
                  modalContent: (
                    <Text>Your unsaved changes will be discarded.</Text>
                  ),
                  actions: {
                    confirm: () => {
                      props.form.reset();
                      setTimeout(() => props.setFocused(false), 500);
                    },
                    cancel: () => {
                      setTimeout(() => props.setFocused(false), 500);
                    },
                  },
                  wrapperId: props.wrapperId,
                }}
              >
                <Button
                  size="xs"
                  color="gray"
                  variant="light"
                  disabled={props.submitted}
                >
                  Cancel
                </Button>
              </ModalPrompt>

              <Button
                size="xs"
                loading={props.submitted}
                onClick={async () => {
                  if (props.form.isDirty()) {
                    await props.handleSubmit(props.updateState, false);
                    props.form.resetDirty();
                    props.setFocused(false);
                  }

                  props.form.resetTouched();
                }}
              >
                Save
              </Button>
            </Group>
          </div>
        )}
      </Transition>
    </Box>
  );
}
