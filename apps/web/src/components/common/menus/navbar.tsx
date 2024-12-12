'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Button,
  Card,
  Grid,
  GridCol,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { typeMenuNavbar } from '@/types/components/menu';

import classes from './navbar.module.scss';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import CardMenu from '../cards/menu';

export default function Navbar({
  children,
  subLinks,
}: {
  children: React.ReactNode;
  subLinks?: typeMenuNavbar[];
}) {
  const pathname = usePathname();

  const megaMenu = subLinks && subLinks[0].desc;

  const menuItems =
    subLinks &&
    subLinks.map((item) => (
      <MenuItem
        key={item.link}
        component={Link}
        href={item.link}
        leftSection={
          item.leftSection &&
          !megaMenu && (
            <item.leftSection size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          )
        }
        rightSection={
          item.rightSection &&
          !megaMenu && (
            <item.rightSection size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          )
        }
        className={`${classes.item} ${pathname == item.link ? classes.itemActive : ''}`}
      >
        {!item.desc ? item.label : <CardMenu props={item} />}
      </MenuItem>
    ));

  return (
    <Menu
      shadow="xs"
      width={'auto'}
      trigger="click-hover"
      openDelay={50}
      closeDelay={50}
      transitionProps={{ transition: 'fade-down' }}
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

      {menuItems && (
        <MenuDropdown maw={560}>
          {!megaMenu ? (
            menuItems
          ) : (
            <Stack gap={0}>
              <Grid gutter={0}>
                {menuItems.map((menuItem, index) => (
                  <GridCol key={index} span={{ base: 12, xs: 6 }}>
                    {menuItem}
                  </GridCol>
                ))}
              </Grid>

              <Card
                bg={'var(--mantine-color-pri-6)'}
                c={'var(--mantine-color-body)'}
                radius={0}
              >
                <Group justify="space-between">
                  <Stack gap={4}>
                    <Title order={3} fz={'sm'} lh={1}>
                      Get started
                    </Title>
                    <Text fz={'xs'}>
                      Their food sources have decreased, and their numbers
                    </Text>
                  </Stack>

                  <Button variant="default">Get Started</Button>
                </Group>
              </Card>
            </Stack>
          )}
        </MenuDropdown>
      )}
    </Menu>
  );
}
