'use client';

import React from 'react';

import {
  Button,
  Divider,
  Grid,
  GridCol,
  Stack,
  TextInput,
} from '@mantine/core';

import AuthProviders from '@/components/common/buttons/auth-providers';

import { useFormAuthSignIn } from '@/hooks/form/auth/sign-in';

export default function Auth({ action }: { action: 'sign-in' | 'sign-up' }) {
  const { form, submitted, handleSubmit } = useFormAuthSignIn({ action });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        <Grid>
          <GridCol span={{ base: 12, sm: 12 }}>
            <TextInput
              required
              aria-label="Email"
              placeholder="Email"
              {...form.getInputProps('email')}
            />
          </GridCol>

          <GridCol span={12}>
            <Button fullWidth type="submit" loading={submitted}>
              {submitted ? 'Signing In' : 'Sign In'}
            </Button>
          </GridCol>
        </Grid>

        <Divider label="or continue with" />

        <AuthProviders />
      </Stack>
    </form>
  );
}
