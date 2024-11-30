'use client';

import React from 'react';

import {
  Box,
  Button,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { useFormUserAccountDelete } from '@/hooks/form/account/delete';

export default function Delete({ close }: { close?: () => void }) {
  const { form, submitted, handleSubmit } = useFormUserAccountDelete();

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        <PasswordInput
          label={'Password'}
          placeholder="********"
          {...form.getInputProps('password')}
        />

        <TextInput
          required
          label={'Confirmation'}
          placeholder="DELETE"
          description="Enter 'DELETE' to confirm deletion"
          {...form.getInputProps('confirmation')}
        />

        <Flex justify={{ base: 'center', xs: 'end' }} gap={'xs'}>
          <Button
            variant="default"
            disabled={submitted}
            onClick={() => {
              form.reset();
              if (close) {
                close();
              }
            }}
          >
            {submitted ? 'Deleting Account' : 'Cancel'}
          </Button>

          <Button type="submit" color="red" loading={submitted}>
            {submitted ? 'Deleting Account' : 'Delete Account'}
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
