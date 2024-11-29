'use client';

import React from 'react';

import {
  Anchor,
  Box,
  Button,
  Grid,
  GridCol,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useFormEmailInquiry } from '@/hooks/form/email/inquiry';
import TooltipInputInfo from '../common/tooltips/input/info';
import Link from 'next/link';

export default function Contact({
  props,
  options,
}: {
  props?: { subject?: string; message?: string };
  options?: { modal?: boolean };
}) {
  const { form, submitted, handleSubmit } = useFormEmailInquiry({
    subject: props?.subject,
    message: props?.message,
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          <Grid>
            <GridCol
              span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}
            >
              <TextInput
                required
                label={options?.modal ? undefined : 'Name'}
                aria-label={options?.modal ? 'Name' : undefined}
                placeholder={`Your Name${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('from.name')}
              />
            </GridCol>
            <GridCol
              span={{ base: 12, xs: 6, md: options?.modal ? 12 : undefined }}
            >
              <TextInput
                label={options?.modal ? undefined : 'Phone'}
                aria-label={options?.modal ? 'Phone' : undefined}
                placeholder="Your Phone"
                {...form.getInputProps('phone')}
              />
            </GridCol>
            <GridCol span={{ base: 12 }}>
              <TextInput
                required
                label={options?.modal ? undefined : 'Email'}
                aria-label={options?.modal ? 'Email' : undefined}
                placeholder={`Your Email${options?.modal ? ' *' : ''}`}
                {...form.getInputProps('from.email')}
                rightSection={<TooltipInputInfo />}
              />
            </GridCol>
            <GridCol span={12}>
              <TextInput
                required
                label={options?.modal ? undefined : 'Subject'}
                aria-label={options?.modal ? 'Subject' : undefined}
                placeholder={
                  options?.modal ? 'Subject *' : 'What are you inquiring about?'
                }
                {...form.getInputProps('subject')}
              />
            </GridCol>
          </Grid>
        </GridCol>

        <GridCol span={{ base: 12, md: options?.modal ? 6 : undefined }}>
          <Stack gap={'xs'}>
            <Textarea
              required
              label={options?.modal ? undefined : 'Message'}
              aria-label={options?.modal ? 'Message' : undefined}
              placeholder={
                options?.modal ? 'Message *' : 'Write your message here...'
              }
              autosize
              minRows={7}
              styles={{ input: { height: '100%' } }}
              maxRows={15}
              resize="vertical"
              {...form.getInputProps('message')}
            />

            <Text fz={'sm'} c={'dimmed'}>
              By submitting this form, I agree to the{' '}
              <Anchor component={Link} href="#pp" inherit fw={500}>
                privacy policy
              </Anchor>
              .
            </Text>
          </Stack>
        </GridCol>

        <GridCol span={12}>
          <SimpleGrid cols={{ base: 1, xs: 2 }}>
            <Button
              variant="light"
              fullWidth
              type="reset"
              onClick={() => form.reset()}
              disabled={submitted}
            >
              Clear
            </Button>

            <Button fullWidth type="submit" loading={submitted}>
              {submitted ? 'Sending' : 'Send'}
            </Button>
          </SimpleGrid>
        </GridCol>
      </Grid>
    </Box>
  );
}
