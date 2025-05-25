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
import { useFormBlogReply } from '@/hooks/form/blog/reply';
import TooltipInputInfo from '@/components/common/tooltips/input/info';

export default function Reply({
  commentId,
  replyId,
  close,
}: {
  commentId?: string;
  replyId?: string;
  close?: () => void;
}) {
  const { form, submitted, handleSubmit, session } = useFormBlogReply({
    commentId,
    replyId,
    close,
  });

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
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
            label={'Reply'}
            placeholder="Write your reply here..."
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
              {submitted ? 'Sending' : 'Send'}
            </Button>
          </Group>
        </GridCol>
      </Grid>
    </Box>
  );
}
