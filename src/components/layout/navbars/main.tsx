'use client';

import React from 'react';

import Link from 'next/link';

import { Group, Button, Divider, Anchor, Grid, GridCol } from '@mantine/core';

import LayoutSection from '@/components/layout/section';
import DrawerNavbarMain from '@/components/common/drawers/navbar/main';
import MenuAvatar from '@/components/common/menus/avatar';
import MenuNavbar from '@/components/common/menus/navbar';
import DrawerUser from '@/components/common/drawers/user';
import LayoutBrand from '../brand';
import { SignIn as FragmentSignIn } from '@/components/common/fragments/auth';

import classes from './main.module.scss';
import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
} from '@tabler/icons-react';
import { authUrls, iconSize, iconStrokeWidth } from '@/data/constants';
import { useMediaQuery } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';

export default function Main() {
  const session = useAppSelector((state) => state.session.value);
  const pathname = usePathname();
  const desktop = useMediaQuery('(min-width: 62em)');

  const matchesPath = (link: string) => {
    return pathname == link || (link != '/' && pathname.includes(link));
  };

  const navLinks = links.navbar.map((link) => (
    <MenuNavbar key={link.link} subLinks={link.subLinks}>
      {!link.subLinks ? (
        <Anchor
          component={Link}
          href={link.link}
          className={`${classes.link} ${
            matchesPath(link.link) ? classes.linkActive : ''
          }`}
        >
          {link.label}
        </Anchor>
      ) : (
        <Anchor
          component={Link}
          href={link.link}
          className={`${classes.link} ${
            matchesPath(link.link) ? classes.linkActive : ''
          }`}
          onClick={(e) => e.preventDefault()}
        >
          <Group gap={4}>
            <span>{link.label}</span>
            <IconChevronDown
              size={iconSize}
              stroke={iconStrokeWidth}
              style={{ marginTop: 2 }}
            />
          </Group>
        </Anchor>
      )}
    </MenuNavbar>
  ));

  return (
    <LayoutSection id={'partial-navbar-main'} shadowed>
      <Grid align="center" gutter={0}>
        <GridCol span={{ base: 4, md: 8 }}>
          <Group gap={'lg'} visibleFrom="md">
            <Anchor component={Link} href={'/'}>
              <LayoutBrand />
            </Anchor>

            <Divider orientation="vertical" h={24} my={'auto'} />

            <Group component={'nav'}>{navLinks}</Group>
          </Group>

          <Group hiddenFrom="md" gap={'xs'} justify="space-between">
            <DrawerNavbarMain props={links.navbar} />
          </Group>
        </GridCol>

        <GridCol span={{ base: 4 }} hiddenFrom="md">
          <Group gap={'xs'} justify="center">
            <Anchor component={Link} href={'/'} py={'md'}>
              <LayoutBrand />
            </Anchor>
          </Group>
        </GridCol>

        <GridCol span={{ base: 4 }}>
          <Group justify="end">
            {!session ? (
              <Group gap={'xs'}>
                <FragmentSignIn>
                  <Button size="xs" variant="light">
                    Log In
                  </Button>
                </FragmentSignIn>

                <Button
                  size="xs"
                  component={Link}
                  href={authUrls.signUp}
                  visibleFrom="md"
                >
                  Sign Up
                </Button>
              </Group>
            ) : desktop ? (
              <MenuAvatar />
            ) : (
              <DrawerUser />
            )}
          </Group>
        </GridCol>
      </Grid>
    </LayoutSection>
  );
}

const links = {
  navbar: [
    { link: '/', label: 'Home' },
    { link: '/about', label: 'About' },
    {
      link: '/features',
      label: 'Features',
      subLinks: [
        {
          leftSection: IconCode,
          label: 'Open source',
          link: '/features/open-source',
          desc: "This Pokémon's cry is very loud and distracting",
        },
        {
          leftSection: IconCoin,
          label: 'Free for everyone',
          link: '/features/free-for-everyone',
          desc: "The fluid of Smeargle's tail secretions changes",
        },
        {
          leftSection: IconBook,
          label: 'Documentation',
          link: '/features/documentation',
          desc: 'Yanma is capable of seeing 360 degrees without',
        },
        {
          leftSection: IconFingerprint,
          label: 'Security',
          link: '/features/security',
          desc: "The shell's rounded shape and the grooves on its.",
        },
        {
          leftSection: IconChartPie3,
          label: 'Analytics',
          link: '/features/analytics',
          desc: 'This Pokémon uses its flying ability to quickly chase',
        },
        {
          leftSection: IconNotification,
          label: 'Notifications',
          link: '/features/notifications',
          desc: 'Combusken battles with the intensely hot flames it spews',
        },
      ],
    },
    { link: '/pricing', label: 'Pricing' },
    {
      link: '/blog',
      label: 'Blog',
    },
    {
      link: '/help',
      label: 'Help',
      subLinks: [{ link: '/help/faq', label: "FAQ's" }],
    },
    {
      link: '/contact',
      label: 'Contact Us',
    },
  ],
};
