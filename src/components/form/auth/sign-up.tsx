'use client';

import React from 'react';

import {
  Anchor,
  Button,
  Divider,
  Grid,
  GridCol,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

import AuthProviders from '@/components/common/buttons/auth-providers';
import PopoverPasswordStrength from '@/components/wrapper/popovers/password-strength';
import { SignIn as FragmentSignIn } from '@/components/common/fragments/auth';

import { useFormAuthSignUp } from '@/hooks/form/auth/sign-up';

export default function SignUp() {
  const { form, handleSubmit, submitted } = useFormAuthSignUp();

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        <Stack>
          <Grid>
            <GridCol span={{ base: 12, xs: 6 }}>
              <TextInput
                required
                aria-label="First Name"
                placeholder="First Name"
                {...form.getInputProps('name.first')}
              />
            </GridCol>

            <GridCol span={{ base: 12, xs: 6 }}>
              <TextInput
                required
                aria-label="Last Name"
                placeholder="Last Name"
                {...form.getInputProps('name.last')}
              />
            </GridCol>

            <GridCol span={{ base: 12 }}>
              <TextInput
                required
                aria-label="Email"
                placeholder="Email"
                {...form.getInputProps('email')}
              />
            </GridCol>

            <GridCol span={{ base: 12, xs: 6 }}>
              <PopoverPasswordStrength
                required
                aria-label="Password"
                placeholder="Password"
                value={form.values.password.initial}
                {...form.getInputProps('password.initial')}
              />
            </GridCol>

            <GridCol span={{ base: 12, xs: 6 }}>
              <PasswordInput
                required
                aria-label="Confirm Password"
                placeholder="Confirm Password"
                {...form.getInputProps('password.confirm')}
              />
            </GridCol>

            <GridCol span={12}>
              <Button fullWidth type="submit" loading={submitted}>
                {submitted ? 'Signing Up' : 'Sign Up'}
              </Button>
            </GridCol>
          </Grid>

          <Text fz={'xs'} ta={'center'}>
            Already have an account?{' '}
            <FragmentSignIn>
              <Anchor inherit fw={500} underline="hover">
                Sign In
              </Anchor>
            </FragmentSignIn>
          </Text>
        </Stack>

        <Divider label="or" />

        <AuthProviders />
      </Stack>
    </form>
  );
}
