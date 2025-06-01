import React from 'react';
import Link from 'next/link';
import { Stack, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import LayoutSection from '@/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import IntroPage from '@/components/layout/intros/page';

export default function Error404() {
  return (
    <LayoutSection id={'error-404'}>
      <Stack justify="center" mih={'100vh'} pb={SECTION_SPACING}>
        <IntroPage
          props={{
            path: `404`,
            title: 'Not Found',
            desc: `The page you are trying to open does not exist.`,
          }}
        />

        <Group justify="center">
          <Button
            component={Link}
            href={'/'}
            leftSection={
              <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Go To Home Page
          </Button>
        </Group>
      </Stack>
    </LayoutSection>
  );
}
