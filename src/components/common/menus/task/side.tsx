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
  IconClockPlus,
  IconCopyPlus,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import ModalConfirm from '../../modals/confirm';
import { TaskGet } from '@/types/models/task';
import { useContextMenu } from '@/hooks/ui';

export default function Side({
  item,
  menuProps,
  children,
}: {
  item: TaskGet;
  menuProps: {
    createSession: () => void;
    deleteTask: (input: { values: TaskGet }) => void;
    copyTask: (input: { values: TaskGet }) => void;
    startRename: (input: { values: TaskGet }) => void;
  };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchor } =
    useContextMenu();

  return (
    <>
      <span id="task-menu-target" {...targetProps}>
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

          <MenuDivider />

          <MenuItem
            leftSection={
              <IconCopyPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            onClick={() => {
              menuProps.copyTask({ values: item });
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
                onConfirm: () => menuProps.deleteTask({ values: item }),
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
