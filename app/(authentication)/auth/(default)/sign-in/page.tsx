import React from 'react';

import { Metadata } from 'next';

import { Stack } from '@mantine/core';

import LayoutAuth from '@/components/layout/auth';
import LayoutPage from '@/components/layout/page';
import FormAuthSignIn from '@/components/form/auth/sign-in';

export const metadata: Metadata = { title: 'Sign In' };

export default async function SignIn() {
  return (
    <LayoutPage>
      <Stack>
        <LayoutAuth
          title="Welcome Back!"
          desc="Sign in to access your personalized experience."
        />

        <FormAuthSignIn />
      </Stack>
    </LayoutPage>
  );
}
