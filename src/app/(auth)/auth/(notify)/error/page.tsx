import React from 'react';

import { Metadata } from 'next';

import { Flex, Stack, Text, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';

export const metadata: Metadata = { title: 'Error' };

export default async function Error({ searchParams }: { searchParams: any }) {
  const message = searchParams.message;

  return (
    <LayoutPage>
      <LayoutSection id={'page-sign-out'} containerized={false} margined>
        <Flex
          direction={'column'}
          align={{ base: 'center', md: 'start' }}
          gap={'xl'}
        >
          <Stack gap={'xs'}>
            <Title ta={{ base: 'center', md: 'start' }} order={1}>
              Authenticaton Error
            </Title>

            <Stack gap={0}>
              <Text ta={{ base: 'center', md: 'start' }}>
                Seems we can&apos;t sign you in.
              </Text>

              {message ? (
                <Text ta={{ base: 'center', md: 'start' }}>{message}.</Text>
              ) : (
                <Text ta={{ base: 'center', md: 'start' }}>
                  Perhaps it&apos;s a temporary issue... Try again later.
                </Text>
              )}
            </Stack>
          </Stack>
        </Flex>
      </LayoutSection>
    </LayoutPage>
  );
}
