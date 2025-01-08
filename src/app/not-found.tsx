import React from 'react';

import Link from 'next/link';

import { Stack, Button, Flex, Group } from '@mantine/core';

import { IconArrowLeft } from '@tabler/icons-react';

import LayoutSection from '@/components/layout/section';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import ModalCommunicationSupport from '@/components/common/modals/communication/support';
import IntroPage from '@/components/layout/intro/page';

export default function NotFound() {
  return (
    <LayoutSection id={'page-not-found'}>
      <Stack justify="center" mih={'100vh'} pb={SECTION_SPACING}>
        <IntroPage
          props={{
            path: `404`,
            title: "Something's not right...",
            desc: `The page you are trying to open does not exist. You may have
                    mistyped the address, or the page has been moved to another
                    URL. If you think this is an error contact support.`,
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
                <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              component={Link}
              href={'/'}
              variant="light"
            >
              Go To Home Page
            </Button>

            <ModalCommunicationSupport>
              <Button>Contact Support</Button>
            </ModalCommunicationSupport>
          </Flex>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
