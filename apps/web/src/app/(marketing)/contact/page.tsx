import React from 'react';

import { Metadata } from 'next';

import {
  Anchor,
  Card,
  Center,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

import {
  IconAt,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconClockHour8,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import FormContact from '@/components/form/contact';
import IntroPage from '@/components/layout/intro/page';

import appData from '@/data/app';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';

export const metadata: Metadata = { title: 'Contact' };

export default async function Contact() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: 'Reach Out',
          title: 'Contact Us',
          desc: 'Please reach out to us if you have questions about our enterprise offerings, or anything else.',
        }}
      />

      <LayoutSection id={'page-contact'} margined>
        <Card
          bg={
            'linear-gradient(-60deg, var(--mantine-color-pri-4) 0%, var(--mantine-color-pri-7) 100%)'
          }
          c={'var(--mantine-color-body)'}
          p={{ base: 'xs', xs: 32, lg: 64 }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Stack gap={'xl'}>
              <Stack gap={'xs'} pt={{ base: 'xl', xs: 0 }}>
                <Title order={2} ta={'start'}>
                  Drop Us A Line
                </Title>

                <Text ta={'start'} w={{ md: '80%', lg: '90%' }}>
                  Leave your email and we will get back to you within 24 hours.
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 1, xs: 2, md: 1 }}>
                {dataContact.map((item) => (
                  <Group key={item.link} wrap="nowrap">
                    <ThemeIcon
                      size={ICON_WRAPPER_SIZE + 8}
                      color={'var(--mantine-color-body)'}
                      c={'var(--mantine-color-pri-6)'}
                    >
                      <item.icon
                        size={ICON_SIZE + 8}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ThemeIcon>

                    <Stack gap={0}>
                      <Text component="span" inherit fz={'sm'}>
                        {item.title}
                      </Text>

                      <Anchor
                        href={
                          item.title == 'Working Hours' ? undefined : item.link
                        }
                        target={item.title == 'Address' ? '_blank' : undefined}
                        inherit
                        fw={500}
                        c={'var(--mantine-color-body)'}
                        underline="hover"
                      >
                        {item.label}
                      </Anchor>
                    </Stack>
                  </Group>
                ))}
              </SimpleGrid>

              <Flex align={'center'} gap={'md'}>
                {dataSocials.map((social) => (
                  <Anchor
                    key={social.link}
                    title={social.label}
                    href={social.link}
                  >
                    <Center>
                      <ThemeIcon
                        size={ICON_WRAPPER_SIZE}
                        variant="transparent"
                        c={'var(--mantine-color-body)'}
                      >
                        <social.icon
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ThemeIcon>
                    </Center>
                  </Anchor>
                ))}
              </Flex>
            </Stack>

            <Card
              withBorder
              shadow="xs"
              p={{ base: 'xs', xs: 'xl' }}
              bg={'var(--mantine-color-body)'}
              mt={{ base: 'xl', md: 0 }}
            >
              <FormContact />
            </Card>
          </SimpleGrid>
        </Card>
      </LayoutSection>
    </LayoutPage>
  );
}

export const dataContact = [
  {
    title: 'Email',
    icon: IconAt,
    link: `mailto:${appData.emails.info}`,
    label: appData.emails.info,
  },
  {
    title: 'Phone',
    icon: IconPhone,
    link: `tel:${appData.phones.main}`,
    label: appData.phones.main,
  },
  {
    title: 'Address',
    icon: IconMapPin,
    link: appData.locations.main.pin,
    label: appData.locations.main.location,
  },
  {
    title: 'Working Hours',
    icon: IconClockHour8,
    link: '#working-hours',
    label: `${appData.hours.times} (${appData.hours.days})`,
  },
];

export const dataSocials = [
  {
    icon: IconBrandFacebook,
    link: appData.socials.facebook.link,
    label: appData.socials.facebook.platform,
  },
  {
    icon: IconBrandX,
    link: appData.socials.twitter.link,
    label: appData.socials.twitter.platform,
  },
  {
    icon: IconBrandInstagram,
    link: appData.socials.instagram.link,
    label: appData.socials.instagram.platform,
  },
  {
    icon: IconBrandLinkedin,
    link: appData.socials.linkedin.link,
    label: appData.socials.linkedin.platform,
  },
];
