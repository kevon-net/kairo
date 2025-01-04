'use client';

import React from 'react';

import Link from 'next/link';

import {
  Group,
  Button,
  Divider,
  Anchor,
  Grid,
  GridCol,
  Center,
} from '@mantine/core';

import LayoutSection from '@/components/layout/section';
import DrawerNavbarMain from '@/components/common/drawers/navbar/main';
import MenuUser from '@/components/common/menus/user';
import MenuNavbar from '@/components/common/menus/navbar';
import DrawerUser from '@/components/common/drawers/user';
import { SignIn as WrapperSignIn } from '@/components/wrapper/auth';
import { SignUp as WrapperSignUp } from '@/components/wrapper/auth';

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
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { useMediaQuery } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import ImageDefault from '@/components/common/images/default';
import { images } from '@/assets/images';
import appData from '@/data/app';

export default function Main({
  options,
}: {
  options?: { absolute?: boolean };
}) {
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
          className={`${options?.absolute ? classes.linkAbsolute : classes.link} ${
            matchesPath(link.link) ? classes.linkActive : ''
          }`}
        >
          {link.label}
        </Anchor>
      ) : (
        <Anchor
          component={Link}
          href={link.link}
          className={`${options?.absolute ? classes.linkAbsolute : classes.link} ${
            matchesPath(link.link) ? classes.linkActive : ''
          }`}
          onClick={(e) => e.preventDefault()}
        >
          <Group gap={4}>
            <span>{link.label}</span>
            <IconChevronDown
              size={ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
              style={{ marginTop: 2 }}
            />
          </Group>
        </Anchor>
      )}
    </MenuNavbar>
  ));

  const imageBrand = (
    <ImageDefault
      src={images.brand.logo.light}
      alt={appData.name.app}
      height={{ base: 24 }}
      width={{ base: 72 }}
      fit="contain"
      mode="grid"
    />
  );

  return (
    <LayoutSection
      id={'partial-navbar-main'}
      shadowed={!options?.absolute}
      pos={options?.absolute ? 'absolute' : undefined}
      left={options?.absolute ? 0 : undefined}
      top={options?.absolute ? 0 : undefined}
      right={options?.absolute ? 0 : undefined}
      style={{ zIndex: 1 }}
    >
      <Grid align="center" gutter={0}>
        <GridCol span={{ base: 4, md: 8 }}>
          <Group gap={'lg'} visibleFrom="md">
            <Anchor component={Link} href={'/'}>
              {imageBrand}
            </Anchor>

            <Divider orientation="vertical" h={24} my={'auto'} />

            <Group component={'nav'}>{navLinks}</Group>
          </Group>

          <Group hiddenFrom="md" gap={'xs'} justify="space-between">
            <DrawerNavbarMain
              props={links.navbar}
              options={{ absolute: options?.absolute }}
            />
          </Group>
        </GridCol>

        <GridCol span={{ base: 4 }} hiddenFrom="md">
          <Center>
            <Anchor component={Link} href={'/'} py={'md'}>
              {imageBrand}
            </Anchor>
          </Center>
        </GridCol>

        <GridCol span={{ base: 4 }}>
          <Group justify="end">
            {!session ? (
              <Group gap={'xs'}>
                <WrapperSignIn>
                  <Button
                    size="xs"
                    variant={options?.absolute ? 'outline' : 'light'}
                    color={options?.absolute ? 'white' : undefined}
                  >
                    Log In
                  </Button>
                </WrapperSignIn>

                <WrapperSignUp>
                  <Button size="xs" visibleFrom="md">
                    Sign Up
                  </Button>
                </WrapperSignUp>
              </Group>
            ) : desktop ? (
              <MenuUser />
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
      subLinks: [
        { link: '/help/faq', label: "FAQ's" },
        { link: '/help/support', label: 'Support' },
      ],
    },
    {
      link: '/contact',
      label: 'Contact Us',
    },
  ],
};
