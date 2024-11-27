'use client';

import React from 'react';

import { Button, Grid, GridCol, PasswordInput } from '@mantine/core';

import { useFormAuthPasswordReset } from '@/hooks/form/auth/password';
import PopoverPasswordStrength from '@/components/wrapper/popovers/password-strength';

export default function Reset() {
  const { form, handleSubmit, sending } = useFormAuthPasswordReset();

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12 }}>
          <PopoverPasswordStrength
            required
            aria-label={'New Password'}
            placeholder="New Password"
            value={form.values.password}
            {...form.getInputProps('password.initial')}
          />
        </GridCol>
        <GridCol span={{ base: 12 }}>
          <PasswordInput
            required
            aria-label={'Confirm New Password'}
            placeholder="Confirm New Password"
            {...form.getInputProps('password.confirm')}
          />
        </GridCol>
        <GridCol span={{ base: 12 }}>
          <Button fullWidth type="submit" color="pri" loading={sending}>
            {sending ? 'Resetting' : 'Reset'}
          </Button>
        </GridCol>
      </Grid>
    </form>
  );
}
