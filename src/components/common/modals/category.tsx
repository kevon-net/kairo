'use client';

import React from 'react';
import { Button, Group, Modal, Text, Title } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { IconCategoryPlus } from '@tabler/icons-react';
import FormCategory from '@/components/form/category';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSelectedCategory } from '@/libraries/redux/slices/categories';
import LayoutModalPrompt from '@/components/layout/modal/prompt';
import { useCategory } from '@/hooks/form/category';
import ModalPrompt from './prompt';

export default function Category({ children }: { children: React.ReactNode }) {
  const selectedCategory = useAppSelector(
    (state) => state.categories.selectedCategory
  );
  const dispatch = useAppDispatch();

  const { form, submitted, handleSubmit, addToState, updateState, editing } =
    useCategory();

  const close = () => {
    if (form.isDirty()) {
      const wrapperElement = document.getElementById(wrapperId);
      wrapperElement?.click();
    } else {
      dispatch(updateSelectedCategory(null));
    }
  };

  const submit = () => {
    handleAction();
    form.reset();
    dispatch(updateSelectedCategory(null));
  };

  const cancelButton = (
    <Button size="xs" color="gray" variant="light" disabled={submitted}>
      Cancel
    </Button>
  );

  const handleAction = () => handleSubmit(!editing ? addToState : updateState);

  return (
    <>
      <Modal
        opened={!!selectedCategory?.id}
        onClose={close}
        withCloseButton={false}
        centered
        padding={0}
      >
        <LayoutModalPrompt
          props={{
            title: (
              <Group gap={'xs'}>
                <IconCategoryPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

                <Title order={1} fz={'sm'} fw={500}>
                  Add Project
                </Title>
              </Group>
            ),
            footer: (
              <Group gap={'xs'} justify="end">
                {form.isDirty() ? (
                  <ModalPrompt
                    props={{
                      title: 'Discard unsaved changes?',
                      color: 'red.6',
                      modalContent: (
                        <Text>Your unsaved changes will be discarded.</Text>
                      ),
                      parentModalstate: {
                        opened: !!selectedCategory?.id,
                        close: close,
                      },
                      actions: {
                        confirm: () => {
                          dispatch(updateSelectedCategory(null));
                        },
                      },
                      wrapperId,
                    }}
                  >
                    {cancelButton}
                  </ModalPrompt>
                ) : (
                  <div
                    onClick={() => {
                      close();
                    }}
                  >
                    {cancelButton}
                  </div>
                )}

                <Button
                  size="xs"
                  onClick={submit}
                  disabled={!form.values.title.trim()}
                  loading={submitted}
                >
                  {editing ? 'Save' : 'Create'}
                </Button>
              </Group>
            ),
            close,
          }}
        >
          <FormCategory
            props={{
              form,
              submitted,
              handleAction,
              addToState,
              updateState,
              editing,
              close,
              opened: !!selectedCategory?.id,
              submit,
            }}
          />
        </LayoutModalPrompt>
      </Modal>

      <span>{children}</span>
    </>
  );
}

const wrapperId = 'categoryCreatePrompt';
