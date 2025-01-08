export const dynamic = 'force-dynamic';

import React from 'react';

import { Anchor, Stack, Text, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import ModalDeleteAccount from '@/components/common/modals/delete/account';

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Security' };

export default async function Security() {
  return (
    <LayoutPage stacked>
      <LayoutSection id="page-security-delete" containerized={false}>
        <Stack gap={'lg'} align="start">
          <Title order={2} fz={'xl'}>
            Delete Account
          </Title>

          <Text>
            Our deletion process complies with the{' '}
            <Anchor inherit href="https://gdpr.eu/" target="_blank">
              GDPR regulations
            </Anchor>
            , which requires us to permanently delete user data upon request. As
            such, deleting your account will permanently remove all data
            associated with it and therefore be irreversible.
          </Text>

          <ModalDeleteAccount />
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
