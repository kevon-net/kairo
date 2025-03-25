import { FONT, SECTION_SPACING } from '@/data/constants';
import { Card, Container, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import FormNewsletter from '@/components/form/newsletter';

export default function Newsletter() {
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
              Want our product updates?
            </Title>

            <Text fz={'xl'} ta={'center'}>
              Sign up for our newsletter. Reprehenderit ad esse et non officia
              in nulla. Id proident tempor incididunt nostrud nulla et culpa.
            </Text>
          </Stack>

          <FormNewsletter />
        </Stack>
      </Container>
    </Card>
  );
}
