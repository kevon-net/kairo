'use client';

import React from 'react';

import {
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useFormBlogComment } from '@/hooks/form/blog/comment';

import TooltipInputInfo from '@/components/common/tooltips/input/info';

export default function Comment({ postId }: { postId: string }) {
  const { form, submitted, handleSubmit, session } = useFormBlogComment({
    postId,
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid pb={'md'}>
        <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={'Name'}
            placeholder="Name"
            {...form.getInputProps('name')}
            disabled={session ? true : false}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 6 }}>
          <TextInput
            required
            label={'Email'}
            placeholder="Email"
            {...form.getInputProps('email')}
            disabled={session ? true : false}
            rightSection={<TooltipInputInfo />}
          />
        </GridCol>

        <GridCol span={12}>
          <Textarea
            required
            label={'Comment'}
            placeholder="Write your comment here..."
            autosize
            minRows={3}
            maxRows={5}
            resize="vertical"
            {...form.getInputProps('content')}
          />
        </GridCol>

        <GridCol span={12}>
          <Group>
            <Button type="submit" loading={submitted}>
              {submitted ? 'Commenting' : 'Comment'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </Box>
  );
}
