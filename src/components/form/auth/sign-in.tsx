'use client';

import React from 'react';

import Link from 'next/link';

import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

import AuthProviders from '@/components/common/buttons/auth-providers';

import { useFormAuthSignIn } from '@/hooks/form/auth/sign-in';

export default function SignIn() {
  const { form, submitted, handleSubmit } = useFormAuthSignIn();

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

          <GridCol span={{ base: 12, xs: 12 }}>
            <PasswordInput
              required
              aria-label="Password"
              placeholder="Password"
              value={form.values.password}
              {...form.getInputProps('password')}
              w={'100%'}
            />
          </GridCol>

          <GridCol span={12}>
            <Group justify="space-between">
              <Checkbox
                label="Remember me"
                size="xs"
                key={form.key('remember')}
                {...form.getInputProps('remember', {
                  type: 'checkbox',
                })}
              />

              <Anchor
                underline="hover"
                inherit
                fz={'xs'}
                ta={'end'}
                w={'fit-content'}
                component={Link}
                href={'/auth/password/forgot'}
              >
                Forgot password
              </Anchor>
            </Group>
          </GridCol>

          <GridCol span={12}>
            <Button fullWidth type="submit" loading={submitted}>
              {submitted ? 'Signing In' : 'Sign In'}
            </Button>
          </GridCol>
        </Grid>

        <Divider label="or continue with" />

        <AuthProviders />

        <Text fz={'xs'} ta={'center'}>
          Don&apos;t have an account?{' '}
          <Anchor
            inherit
            fw={500}
            component={Link}
            href={'/auth/sign-up'}
            underline="hover"
          >
            Sign Up
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
