'use client';

import React from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuDivider,
  MenuItem,
  Group,
} from '@mantine/core';
import {
  IconTrash,
  IconPencil,
  IconFilePlus,
  IconFolders,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import ModalConfirm from '../modals/confirm';
import { CategoryGet } from '@/types/models/category';

export default function Category({
  item,
  menuProps,
  children,
}: {
  item: CategoryGet;
  menuProps: {
    createSession: () => void;
    createTask: () => void;
    deleteCategory: (input: { values: CategoryGet }) => void;
    copyCategory: (input: { values: CategoryGet }) => void;
    startRename: (input: { values: CategoryGet }) => void;
  };
  children: React.ReactNode;
}) {
  return (
    <Menu width={160} trigger="click" position="bottom-end" keepMounted>
      <MenuTarget>
        <Group>{children}</Group>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={
            <IconFilePlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => menuProps.createSession()}
        >
          New Session
        </MenuItem>

        <MenuItem
          leftSection={
            <IconFilePlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => menuProps.createTask()}
        >
          New Task
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconFolders size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {
            menuProps.copyCategory({ values: item });
          }}
        >
          Make a copy
        </MenuItem>

        <MenuDivider />

        <MenuItem
          leftSection={
            <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => menuProps.startRename({ values: item })}
        >
          Rename
        </MenuItem>

        <ModalConfirm
          props={{
            actions: {
              onConfirm: () => menuProps.deleteCategory({ values: item }),
            },
          }}
        >
          <MenuItem
            color="red.6"
            leftSection={
              <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Delete
          </MenuItem>
        </ModalConfirm>
      </MenuDropdown>
    </Menu>
  );
}
