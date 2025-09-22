'use client';

import React from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuDivider,
  MenuItem,
} from '@mantine/core';
import {
  IconTrash,
  IconPencil,
  IconCheckbox,
  IconClockPlus,
  IconCopyPlus,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import ModalConfirm from '../../modals/confirm';
import { CategoryGet } from '@/types/models/category';
import { useContextMenu } from '@/hooks/ui';

export default function Side({
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
  const { opened, setOpened, close, menuWidth, targetProps, anchor } =
    useContextMenu();

  return (
    <>
      <span id="category-menu-target" {...targetProps}>
        {children}
      </span>

      <Menu
        opened={opened}
        onChange={setOpened}
        onClose={close}
        withinPortal
        width={menuWidth}
        keepMounted
        styles={{
          dropdown: {
            padding: 5,
          },
          item: {
            padding: '2.5px 10px',
          },
          itemLabel: {
            fontSize: 'var(--mantine-font-size-sm)',
          },
        }}
      >
        <MenuTarget>{anchor}</MenuTarget>

        <MenuDropdown onClick={(e) => e.stopPropagation()}>
          <MenuItem
            leftSection={
              <IconClockPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => menuProps.createSession()}
          >
            New Session
          </MenuItem>

          <MenuItem
            leftSection={
              <IconCheckbox size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => menuProps.createTask()}
          >
            New Task
          </MenuItem>

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconCopyPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
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
    </>
  );
}
