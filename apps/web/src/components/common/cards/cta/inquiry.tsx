import {
  FONT,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

export default function Inquiry() {
  return (
    <Card
      bg={
        'linear-gradient(-60deg, var(--mantine-color-pri-4) 0%, var(--mantine-color-pri-7) 100%)'
      }
      padding={0}
      c={'var(--mantine-color-body)'}
      pos={'relative'}
    >
      <Container size={'sm'}>
        <Stack gap={'xl'} py={SECTION_SPACING}>
          <Stack>
            <Title order={2} fz={FONT.CTA_TITLE} ta={'center'}>
              Want to speak with an expert?
            </Title>

            <Text fz={'xl'} ta={'center'}>
              We&apos;d love to hear about your brand and business challenges,
              even if you&apos;re not sure what your next step is. No pitch, no
              strings attached.
            </Text>
          </Stack>

          <Group justify="center">
            <Button
              color="var(--mantine-color-body)"
              c={'var(--mantine-color-pri-6)'}
              component={Link}
              href={'/contact'}
            >
              Let&apos;s Talk
            </Button>

            <Button
              color="var(--mantine-color-body)"
              variant="transparent"
              rightSection={
                <IconArrowRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
            >
              Learn More
            </Button>
          </Group>
        </Stack>
      </Container>
    </Card>
  );
}
