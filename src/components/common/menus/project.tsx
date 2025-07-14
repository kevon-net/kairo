'use client';

import React, { useMemo } from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuDivider,
  MenuItem,
  Group,
  Text,
} from '@mantine/core';
import { IconTrash, IconPencil } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSelectedCategory } from '@/libraries/redux/slices/categories';
import { useCategory } from '@/hooks/form/category';
import ModalPrompt from '../modals/prompt';

export default function Project({
  props,
  children,
}: {
  props: { id: string };
  children: React.ReactNode;
}) {
  const categories = useAppSelector((state) => state.categories.value);
  const category = useMemo(
    () => categories?.find((c) => c.id == props.id),
    [categories, props.id]
  );

  const dispatch = useAppDispatch();

  const { handleSubmit, deleteFromState } = useCategory({ id: props.id });

  return (
    <Menu width={160} trigger="click" position="bottom-end" keepMounted>
      <MenuTarget>
        <Group>{children}</Group>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={
            <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => dispatch(updateSelectedCategory(category || null))}
        >
          Edit
        </MenuItem>

        <MenuDivider />

        <ModalPrompt
          props={{
            title: `Delete project?`,
            color: 'red.6',
            modalContent: (
              <Text>
                The project{' '}
                {category ? (
                  <Text component="span" fw={'bold'}>
                    {category.title}
                  </Text>
                ) : null}{' '}
                will be deleted. All project tasks will be sent to inbox.
              </Text>
            ),
            actions: {
              confirm: () => handleSubmit(deleteFromState),
            },
          }}
        >
          <MenuItem
            color="red"
            leftSection={
              <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Delete
          </MenuItem>
        </ModalPrompt>
      </MenuDropdown>
    </Menu>
  );
}
