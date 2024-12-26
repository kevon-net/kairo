'use client';

import React, { useState } from 'react';

import { Button, Grid, GridCol } from '@mantine/core';

import { images } from '@/assets/images';
import { capitalizeWords } from '@repo/utils/formatters';
import ImageDefault from '@/components/common/images/default';
import { API_URL } from '@/data/constants';
import { createClient } from '@/libraries/supabase/client';

export default function Providers() {
  const [loading, setLoading] = useState('');

  const supabase = createClient();

  const getButton = (providerDetails: { image: string; provider: string }) => (
    <Button
      key={providerDetails.provider}
      fullWidth
      variant="default"
      onClick={async () => {
        setLoading(providerDetails.provider);
        // window.location.href = `/api/auth/sign-in/google?redirect=${encodeURIComponent(getUrlParam('redirect'))}`;

        await supabase.auth.signInWithOAuth({
          provider: providerDetails.provider.toLocaleLowerCase() as any,
          options: {
            redirectTo: `${API_URL}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
      }}
      loading={loading == providerDetails.provider}
      leftSection={
        <ImageDefault
          src={providerDetails.image}
          alt={providerDetails.provider}
          height={24}
          width={24}
          mode="grid"
        />
      }
    >
      {providerDetails.provider != providerDetails.provider
        ? capitalizeWords(providerDetails.provider)
        : 'Email (SSO)'}
    </Button>
  );

  return (
    <Grid>
      {providers.map((provider) => (
        <GridCol key={provider.provider} span={{ base: 12, xs: 6 }}>
          {getButton(provider)}
        </GridCol>
      ))}
    </Grid>
  );
}

const providers = [
  {
    image: images.icons.credentials,
    provider: 'credentials',
  },
  {
    image: images.icons.google,
    provider: 'google',
  },
  {
    image: 'https://img.icons8.com/?size=100&id=16318&format=png&color=000000',
    provider: 'github',
  },
];
