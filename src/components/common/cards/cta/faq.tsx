import { FONT, SECTION_SPACING } from '@/data/constants';
import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export default function Faq() {
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
              Still have a question?
            </Title>

            <Text fz={'xl'} ta={'center'}>
              We&apos;d be happy to help you with any questions you have! Please
              let us know what you&apos;re looking for, and we&apos;ll do our
              best to assist you.
            </Text>
          </Stack>

          <Group justify="center">
            <Button
              color="var(--mantine-color-body)"
              c={'var(--mantine-color-pri-6)'}
              component={Link}
              href={'/contact'}
            >
              Contact Us
            </Button>
          </Group>
        </Stack>
      </Container>
    </Card>
  );
}
