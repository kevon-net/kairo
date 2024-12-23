'use client';

import React from 'react';

import { Box, Drawer, NavLink, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import MenuUser from '@/components/common/menus/user';
import PartialUser from '@/components/partial/user';

import classes from './user.module.scss';
import { navLinkItems } from '@/components/layout/asides/account';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function User() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  const matchesPath = (link: string) => {
    return pathname == link || (link != '/' && pathname.includes(link));
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        position="right"
        transitionProps={{ transition: 'slide-left' }}
        size={240}
        classNames={{ body: classes.body, header: classes.header }}
      >
        <Stack>
          <PartialUser />

          <Stack gap={0}>
            {navLinkItems.account.map((link) => (
              <NavLink
                key={link.link}
                component={Link}
                href={link.link}
                label={link.label}
                onClick={close}
                fw={pathname == link.link ? 500 : undefined}
                leftSection={
                  <link.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                className={
                  matchesPath(link.link) ? classes.linkActive : classes.link
                }
              />
            ))}

            {navLinkItems.support.map((link) => (
              <NavLink
                key={link.link}
                component={Link}
                href={link.link}
                label={link.label}
                onClick={close}
                fw={pathname == link.link ? 500 : undefined}
                leftSection={
                  <link.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                className={
                  matchesPath(link.link) ? classes.linkActive : classes.link
                }
              />
            ))}

            {navLinkItems.danger.map((link) => (
              <NavLink
                key={link.link}
                component={Link}
                href={link.link}
                label={link.label}
                onClick={close}
                fw={pathname == link.link ? 500 : undefined}
                leftSection={
                  <link.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                className={
                  matchesPath(link.link)
                    ? classes.linkDangerActive
                    : classes.linkDanger
                }
              />
            ))}
          </Stack>
        </Stack>
      </Drawer>

      <Box
        onClick={toggle}
        aria-label="Toggle User Navbar"
        style={{ cursor: 'pointer' }}
      >
        <MenuUser />
      </Box>
    </>
  );
}
