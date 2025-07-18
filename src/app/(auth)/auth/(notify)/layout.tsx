import React from 'react';
import Link from 'next/link';
import { Anchor, Center, Grid, GridCol, Stack } from '@mantine/core';
import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';
import ImageDefault from '@/components/common/images/default';
import { images } from '@/assets/images';
import { SECTION_SPACING } from '@/data/constants';
import { appName } from '@/data/app';

export default function LayoutNotify({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <Grid gutter={0} px={{ base: 'md', xs: 0 }}>
        <GridCol
          span={5.5}
          visibleFrom="md"
          bg={'var(--mantine-color-pri-light)'}
        >
          <LayoutSection
            id={'layout-auth-notify-icon'}
            containerized="xs"
            pos={'sticky'}
            top={0}
          >
            <Center h={'100vh'} px={{ xs: 32 }}>
              <Anchor component={Link} href={'/'}>
                <ImageDefault
                  src={images.brand.icon.default}
                  alt={appName}
                  height={128}
                  width={128}
                  fit={'contain'}
                  mode="grid"
                />
              </Anchor>
            </Center>
          </LayoutSection>
        </GridCol>

        <GridCol span={{ base: 12, md: 6.5 }}>
          <LayoutSection id={'layout-auth-notify-text'} containerized="xs">
            <Stack
              gap={'xl'}
              justify="center"
              mih={'100vh'}
              px={{ xs: 32 }}
              py={SECTION_SPACING}
            >
              {children}
            </Stack>
          </LayoutSection>
        </GridCol>
      </Grid>
    </LayoutBody>
  );
}
