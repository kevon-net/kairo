import React from 'react';

import NextImage from 'next/image';

import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';

import { Stack, Image, Group, Anchor, Center, Card } from '@mantine/core';
import { images } from '@/assets/images';
import appData from '@/data/app';
import Link from 'next/link';

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutSection id={'layout-auth-form'} containerized="xs">
        <Center mih={'100vh'} px={{ base: 0, sm: 40 }} py={64}>
          <Card
            shadow="xs"
            withBorder
            bg={'transparent'}
            p={{ base: 'xl', xs: 40 }}
          >
            <Stack gap={'xl'}>
              <Anchor component={Link} href={'/'}>
                <Group justify="center">
                  <Image
                    src={images.logo.light}
                    alt={appData.name.app}
                    h={{ base: 28 }}
                    component={NextImage}
                    width={1920}
                    height={1080}
                    priority
                  />
                </Group>
              </Anchor>

              {children}
            </Stack>
          </Card>
        </Center>
      </LayoutSection>
    </LayoutBody>
  );
}
