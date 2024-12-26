import React from 'react';

import { Metadata } from 'next';

import { Anchor, Stack, Text } from '@mantine/core';

import LayoutAuth from '@/components/layout/auth';
import LayoutPage from '@/components/layout/page';
import FormAuth from '@/components/form/auth';
import { AUTH_URLS } from '@/data/constants';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Sign In' };

export default async function SignIn() {
  return (
    <LayoutPage>
      <Stack>
        <LayoutAuth
          title="Welcome Back!"
          desc="Sign in to access your personalized experience."
        />

        <FormAuth action="sign-in" />

        <Text fz={'xs'} ta={'center'}>
          Don&apos;t have an account?{' '}
          <Anchor
            inherit
            fw={500}
            component={Link}
            href={AUTH_URLS.SIGN_UP}
            underline="hover"
          >
            Sign Up
          </Anchor>
        </Text>
      </Stack>
    </LayoutPage>
  );
}
