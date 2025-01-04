import React from 'react';

import { Metadata } from 'next';
import Link from 'next/link';

import { Button, Flex, Group, Stack, Text, Title } from '@mantine/core';

import { IconArrowRight } from '@tabler/icons-react';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';

import { SignOut as WrapperSignOut } from '@/components/wrapper/auth';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export const metadata: Metadata = { title: 'Sign Out' };

export default async function SignOut() {
  return (
    <LayoutPage>
      <LayoutSection
        id={'page-sign-out-sign-out'}
        containerized={false}
        margined
      >
        <Flex
          direction={'column'}
          align={{ base: 'center', md: 'start' }}
          gap={'xl'}
        >
          <Stack gap={'xs'}>
            <Title ta={{ base: 'center', md: 'start' }} order={1} fw={'bold'}>
              Sign Out
            </Title>

            <Stack gap={0}>
              <Text ta={{ base: 'center', md: 'start' }}>
                Are you sure you want to sign out?
              </Text>
            </Stack>
          </Stack>

          <Group>
            <WrapperSignOut>
              <Button>Sign Out</Button>
            </WrapperSignOut>

            <Button
              component={Link}
              href={'/'}
              variant="light"
              rightSection={
                <IconArrowRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Go Home
            </Button>
          </Group>
        </Flex>
      </LayoutSection>
    </LayoutPage>
  );
}
