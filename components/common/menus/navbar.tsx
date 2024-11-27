'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, MenuDropdown, MenuItem, MenuTarget } from '@mantine/core';

import { typeMenuNavbar } from '@/types/components/menu';

import classes from './navbar.module.scss';
import { iconSize, iconStrokeWidth } from '@/data/constants';

export default function Navbar({
  children,
  subLinks,
}: {
  children: React.ReactNode;
  subLinks?: typeMenuNavbar[];
}) {
  const pathname = usePathname();

  const menuItems =
    subLinks &&
    subLinks.map((item) => (
      <MenuItem
        key={item.link}
        component={Link}
        href={item.link}
        leftSection={
          item.leftSection && (
            <item.leftSection size={iconSize} stroke={iconStrokeWidth} />
          )
        }
        rightSection={
          item.rightSection && (
            <item.rightSection size={iconSize} stroke={iconStrokeWidth} />
          )
        }
        className={`${classes.item} ${pathname == item.link ? classes.itemActive : ''}`}
      >
        {item.label}
      </MenuItem>
    ));

  return (
    <Menu
      shadow="xs"
      width={'auto'}
      trigger="hover"
      openDelay={50}
      closeDelay={50}
      classNames={{
        dropdown: classes.dropdown,
        arrow: classes.arrow,
        divider: classes.divider,
        label: classes.label,
        item: classes.item,
        itemLabel: classes.itemLabel,
        itemSection: classes.itemSection,
      }}
    >
      <MenuTarget>{children}</MenuTarget>

      {menuItems && <MenuDropdown>{menuItems}</MenuDropdown>}
    </Menu>
  );
}
