import { Button, Card, CardSection, Divider, Group, Text } from '@mantine/core';
import React from 'react';
import FormTaskCreate from '@/components/form/task/create';
import ComboboxTaskProject from '@/components/common/inputs/combobox/task/project';
import ModalPrompt from '@/components/common/modals/prompt';

export default function Create({
  props,
}: {
  props: {
    form: any;
    opened?: boolean;
    handleClose: () => void;
    submitted: boolean;
    handleSubmit: (
      operation: () => void,
      resetOnSubmit?: boolean
    ) => Promise<void>;
    addTaskToState: () => void;
  };
}) {
  const cancelButton = (
    <Button size="xs" color="gray" variant="light" disabled={props.submitted}>
      Cancel
    </Button>
  );

  return (
    <Card
      bg={'transparent'}
      padding={'lg'}
      style={{ overflow: 'visible' }}
      withBorder
    >
      <div>
        <FormTaskCreate props={{ form: props.form as any }} />
      </div>

      <CardSection>
        <Divider my={'lg'} />
      </CardSection>

      <Group justify="space-between">
        <ComboboxTaskProject props={{ formTask: props.form }} />

        <Group gap={'xs'}>
          {props.form.isDirty() ? (
            <ModalPrompt
              props={{
                title: 'Discard unsaved changes?',
                color: 'red.6',
                modalContent: (
                  <Text>Your unsaved changes will be discarded.</Text>
                ),
                parentModalstate: props.opened
                  ? { opened: props.opened, close }
                  : undefined,
                actions: {
                  confirm: () => props.handleClose(),
                },
                wrapperId,
              }}
            >
              {cancelButton}
            </ModalPrompt>
          ) : (
            <div onClick={props.handleClose}>{cancelButton}</div>
          )}

          <Button
            size="xs"
            onClick={async () => {
              await props.handleSubmit(props.addTaskToState, true);
              close();
            }}
            disabled={!props.form.values.title.trim()}
            loading={props.submitted}
          >
            Add Task
          </Button>
        </Group>
      </Group>
    </Card>
  );
}

const wrapperId = 'taskCreatePrompt';
