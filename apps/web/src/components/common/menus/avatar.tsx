'use client';

import React from 'react';

import Link from 'next/link';

import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
  Stack,
  Skeleton,
  Title,
  MenuLabel,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import AvatarMain from '../avatars/main';

import classes from './avatar.module.scss';
import { navLinkItems } from '@/components/layout/asides/account';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useAppSelector } from '@/hooks/redux';
import { usePathname } from 'next/navigation';
// import { getRegionalDate } from '@/utilities/formatters/date';

export default function Avatar() {
  const session = useAppSelector((state) => state.session.value);

  const mobile = useMediaQuery('(max-width: 48em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  const pathname = usePathname();

  const matchesPath = (link: string) => {
    return pathname == link || (link != '/' && pathname.includes(link));
  };

  return (
    <Menu
      position={'bottom-end'}
      offset={{ mainAxis: 16, crossAxis: 0 }}
      width={mobile ? 200 : 240}
      trigger="click-hover"
      openDelay={50}
      closeDelay={50}
      classNames={classes}
      opened={desktop ? undefined : false}
      transitionProps={{ transition: 'pop-top-right' }}
      withArrow
      arrowOffset={16}
    >
      <MenuTarget>
        <div className={classes.target}>
          <AvatarMain size={40} />
        </div>
      </MenuTarget>

      <MenuDropdown>
        {!session ? (
          <Stack gap={'xs'} align="center">
            <Skeleton height={16} w={'50%'} radius="sm" />
            <Skeleton height={16} w={'100%'} radius="sm" />
          </Stack>
        ) : (
          session && (
            <Stack gap={4} p={'md'}>
              <Title order={3} fz={'md'} lh={1} ta={'center'}>
                {session.user.name}
              </Title>
              <Text fz={'sm'} ta={'center'}>
                {session.user.email}
              </Text>

              {/* <Text fz={'xs'} ta={'center'}>
                ({getRegionalDate(session.expires).date})
              </Text> */}
            </Stack>
          )
        )}

        <MenuDivider my={0} />

        <MenuLabel>Account</MenuLabel>

        {navLinkItems.account.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={
              matchesPath(item.link) ? classes.itemActive : classes.item
            }
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider my={0} />

        <MenuLabel>Support</MenuLabel>

        {navLinkItems.support.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={
              matchesPath(item.link) ? classes.itemActive : classes.item
            }
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider my={0} />

        <MenuLabel>Danger</MenuLabel>

        {navLinkItems.danger.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={
              matchesPath(item.link)
                ? classes.itemDangerActive
                : classes.itemDanger
            }
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
