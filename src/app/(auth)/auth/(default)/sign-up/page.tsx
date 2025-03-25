import React from 'react';

import { Metadata } from 'next';

import { Anchor, Stack, Text } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutAuth from '@/components/layout/auth';
import FormAuth from '@/components/form/auth';
import Link from 'next/link';
import { AUTH_URLS } from '@/data/constants';

export const metadata: Metadata = { title: 'Sign Up' };

export default async function SignUp() {
  return (
    <LayoutPage>
      <Stack>
        <LayoutAuth
          title="Create Your Account"
          desc="Join us and start your journey today."
        />

        <FormAuth action="sign-up" />

        <Text fz={'xs'} ta={'center'}>
          Already have an account?{' '}
          <Anchor
            inherit
            fw={500}
            component={Link}
            href={AUTH_URLS.SIGN_IN}
            underline="hover"
          >
            Sign In
          </Anchor>
        </Text>
      </Stack>
    </LayoutPage>
  );
}
