import React from 'react';

import { Metadata } from 'next';

import { Flex, Stack, Text, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';

export const metadata: Metadata = { title: 'Verify Request' };

export default async function VerifyRequest({
  searchParams,
}: {
  searchParams: any;
}) {
  const message = searchParams.message;

  return (
    <LayoutPage>
      <LayoutSection id={'page-verify-request'} containerized={false} padded>
        <Flex
          direction={'column'}
          align={{ base: 'center', md: 'start' }}
          gap={'xl'}
        >
          <Stack gap={'xs'}>
            <Title ta={{ base: 'center', md: 'start' }} order={1} fw={'bold'}>
              Check Your Email
            </Title>

            <Stack gap={0}>
              <Text ta={{ base: 'center', md: 'start' }}>
                {message} Remember to check the spam/junk folder(s).
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </LayoutSection>
    </LayoutPage>
  );
}
