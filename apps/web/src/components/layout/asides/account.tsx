'use client';

import React from 'react';

import Link from 'next/link';

import { Divider, NavLink, Stack, Title } from '@mantine/core';
import {
  IconBellRinging,
  IconChevronRight,
  IconHeart,
  IconHelpCircle,
  IconInfoCircle,
  IconLicense,
  IconLock,
  IconLogout,
  IconPackage,
  IconStar,
  IconUser,
} from '@tabler/icons-react';

import LayoutSection from '@/components/layout/section';
import PartialUser from '@/components/partial/user';

import {
  AUTH_URLS,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import { usePathname } from 'next/navigation';

import classes from './account.module.scss';

export default function Account() {
  const pathname = usePathname();

  const matchesPath = (link: string) => {
    return pathname == link || (link != '/' && pathname.includes(link));
  };

  return (
    <LayoutSection
      containerized={false}
      id={'partial-aside-user'}
      pos={'sticky'}
      top={SECTION_SPACING}
    >
      <Stack gap={48} align="center">
        <PartialUser />

        <Stack w={'100%'}>
          {/* <Stack gap={'xs'}>
            <Title order={3} fz={'md'} ml={{ md: 'sm' }}>
              Activity
            </Title>

            <Stack gap={4}>
              {navLinkItems.activity.map((item) => (
                <NavLink
                  key={item.label}
                  component={Link}
                  href={item.link}
                  label={item.label}
                  leftSection={<item.icon size={16} stroke={ICON_STROKE_WIDTH} />}
                  rightSection={<IconChevronRight size={16} />}
                  active={matchesPath(item.link)}
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                  className={matchesPath(item.link) ? classes.linkActive : classes.link}
                />
              ))}
            </Stack>
          </Stack>

          <Divider /> */}

          <Stack gap={'xs'}>
            <Title order={3} fz={'md'} ml={{ md: 'sm' }}>
              Settings
            </Title>

            <Stack gap={4}>
              {navLinkItems.account.map((item) => (
                <NavLink
                  key={item.label}
                  component={Link}
                  href={item.link}
                  label={item.label}
                  leftSection={
                    <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                  rightSection={
                    <IconChevronRight
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                  active={matchesPath(item.link)}
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                  className={
                    matchesPath(item.link) ? classes.linkActive : classes.link
                  }
                />
              ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap={'xs'}>
            <Title order={3} fz={'md'} ml={{ md: 'sm' }}>
              Support
            </Title>

            <Stack gap={4}>
              {navLinkItems.support.map((item) => (
                <NavLink
                  key={item.label}
                  component={Link}
                  href={item.link}
                  label={item.label}
                  leftSection={
                    <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                  rightSection={
                    <IconChevronRight
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                  active={matchesPath(item.link)}
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                  }}
                  className={
                    matchesPath(item.link) ? classes.linkActive : classes.link
                  }
                />
              ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap={4}>
            {navLinkItems.danger.map((item) => (
              <NavLink
                key={item.label}
                component={Link}
                href={item.link}
                label={item.label}
                active={matchesPath(item.link)}
                className={classes.linkDanger}
                leftSection={
                  <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
                rightSection={
                  <IconChevronRight
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
                style={{
                  borderRadius: 'var(--mantine-radius-md)',
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </LayoutSection>
  );
}

export const navLinkItems = {
  activity: [
    {
      icon: IconHeart,
      link: `/account/wishlist`,
      label: 'My Wishlist',
    },
    {
      icon: IconPackage,
      link: `/account/orders`,
      label: 'My Orders',
    },
    {
      icon: IconStar,
      link: `/account/reviews`,
      label: 'My Reviews',
    },
  ],
  account: [
    {
      icon: IconUser,
      link: `/account/profile`,
      label: 'Profile Settings',
    },
    {
      icon: IconLock,
      link: `/account/security`,
      label: 'Account Security',
    },
    // {
    // 	icon: IconCoins,
    // 	link: `/account/payment`,
    // 	label: "Payment Details",
    // },
    // {
    // 	icon: IconMapPin,
    // 	link: `/account/addresses`,
    // 	label: "Addresses",
    // },
    {
      icon: IconBellRinging,
      link: `/account/notifications`,
      label: 'Notifications',
    },
  ],
  support: [
    {
      icon: IconHelpCircle,
      link: `/help`,
      label: 'Help Center',
    },
    {
      icon: IconLicense,
      link: `/legal/terms-and-conditions`,
      label: 'Terms and Conditions',
    },
    {
      icon: IconInfoCircle,
      link: `/legal/privacy-policy`,
      label: 'Privacy Policy',
    },
  ],
  danger: [
    {
      icon: IconLogout,
      link: AUTH_URLS.SIGN_OUT,
      label: 'Sign Out',
    },
  ],
};
