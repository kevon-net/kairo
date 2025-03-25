import React from 'react';

import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';
import ImageDefault from '@/components/common/images/default';

import { Stack, Anchor, Center, Card } from '@mantine/core';
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
                <ImageDefault
                  src={images.brand.logo.light}
                  alt={appData.name.app}
                  height={{ base: 28 }}
                  fit="contain"
                  mode="grid"
                />
              </Anchor>

              {children}
            </Stack>
          </Card>
        </Center>
      </LayoutSection>
    </LayoutBody>
  );
}
