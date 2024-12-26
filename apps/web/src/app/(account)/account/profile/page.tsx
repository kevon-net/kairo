import React from 'react';

import { Grid, GridCol, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import FormUserProfile from '@/components/form/user/profile';
import { Metadata } from 'next';
import DropzoneAvatar from '@/components/common/dropzones/avatar';

export const metadata: Metadata = { title: 'Profile' };

export default async function Profile() {
  return (
    <LayoutPage stacked>
      <LayoutSection id="page-profile-picture" containerized={false}>
        <Grid>
          <GridCol span={{ base: 12 }}>
            <Title order={2} fz={'xl'}>
              Profile Picture
            </Title>
          </GridCol>

          <GridCol span={{ base: 12, lg: 9 }}>
            <DropzoneAvatar w={'100%'} />
          </GridCol>
        </Grid>
      </LayoutSection>

      <LayoutSection id="page-profile-personal" containerized={false}>
        <Grid>
          <GridCol span={{ base: 12 }}>
            <Title order={2} fz={'xl'}>
              Personal Information
            </Title>
          </GridCol>

          <GridCol span={{ base: 12, md: 9, xl: 6 }}>
            <FormUserProfile />
          </GridCol>
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
