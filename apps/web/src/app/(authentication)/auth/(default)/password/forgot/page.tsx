import React from 'react';

import { Metadata } from 'next';

import { Stack } from '@mantine/core';

import LayoutAuth from '@/components/layout/auth';
import LayoutPage from '@/components/layout/page';
import FormAuthPasswordForgot from '@/components/form/auth/password/forgot';

export const metadata: Metadata = { title: 'Forgot Password' };

export default async function Forgot() {
  return (
    <LayoutPage>
      <Stack>
        <LayoutAuth
          title="Forgot Password?"
          desc="No worries, we've got your back. Let's recover your account."
        />

        <FormAuthPasswordForgot />
      </Stack>
    </LayoutPage>
  );
}
