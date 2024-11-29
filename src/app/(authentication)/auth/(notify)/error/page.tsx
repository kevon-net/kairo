import React from 'react';

import { Metadata } from 'next';
import Link from 'next/link';

import { Button, Flex, Group, Stack, Text, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import { SignIn as FragmentSignIn } from '@/components/common/fragments/auth';

import { IconArrowRight } from '@tabler/icons-react';
import { iconSize, iconStrokeWidth } from '@/data/constants';

export const metadata: Metadata = { title: 'Authentication Error' };

export default async function AuthenticationError() {
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
              <Text ta={{ base: 'center', md: 'start' }}>
                Perhaps it&apos;s a temporary issue... Try again later.
              </Text>
            </Stack>
          </Stack>

          <Group>
            <FragmentSignIn>
              <Button>Try Again</Button>
            </FragmentSignIn>

            <Button
              component={Link}
              href={'/'}
              variant="light"
              rightSection={
                <IconArrowRight size={iconSize} stroke={iconStrokeWidth} />
              }
            >
              Back Home
            </Button>
          </Group>
        </Flex>
      </LayoutSection>
    </LayoutPage>
  );
}
