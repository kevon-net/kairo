'use client';

import React from 'react';
import { Stack, Button, Flex, Group } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import LayoutSection from '@/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import IntroPage from '@/components/layout/intro/page';

export default function GlobalError({
  // error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <LayoutSection id={'page-not-found'}>
          <Stack justify="center" mih={'100vh'} pb={SECTION_SPACING}>
            <IntroPage
              props={{
                path: `500`,
                title: 'Something Went Wrong!',
                desc: `The page you are trying to open has triggered an error. Our servers seem to have run into a problem. You can try again later.`,
              }}
            />

            <Group justify="center">
              <Flex
                direction={{ base: 'column', xs: 'row' }}
                align={'center'}
                gap={'md'}
              >
                <Button
                  leftSection={
                    <IconRefresh size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  }
                  variant="light"
                  onClick={() => reset()}
                >
                  Try Again
                </Button>
              </Flex>
            </Group>
          </Stack>
        </LayoutSection>
      </body>
    </html>
  );
}
