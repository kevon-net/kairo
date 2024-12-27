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
import { AuthAction } from '@/types/auth';

export default function Auth({ action }: { action: AuthAction }) {
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
              {action === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </Button>
          </GridCol>
        </Grid>

        <Divider label="or" />

        <AuthProviders />
      </Stack>
    </form>
  );
}
