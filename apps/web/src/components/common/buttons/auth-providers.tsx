'use client';

import React, { useState } from 'react';

import { Button, Grid, GridCol } from '@mantine/core';

import { images } from '@/assets/images';
import { capitalizeWords } from '@repo/utils/formatters';
import { useOs } from '@mantine/hooks';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import ImageDefault from '@/components/common/images/default';
import { API_URL, COOKIE_NAME } from '@/data/constants';
import { getUrlParam, setCookie } from '@repo/utils/helpers';
import { createClient } from '@/libraries/supabase/client';

export default function Providers() {
  const [loading, setLoading] = useState('');
  const os = useOs();

  const supabase = createClient();

  const getButton = (providerDetails: {
    image: string;
    provider: Provider;
  }) => (
    <Button
      key={providerDetails.provider}
      fullWidth
      variant="default"
      onClick={async () => {
        setLoading(providerDetails.provider);
        setCookie(COOKIE_NAME.DEVICE.OS, { os }, { expiryInSeconds: 15 * 60 });
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
      {providerDetails.provider != Provider.CREDENTIALS
        ? capitalizeWords(providerDetails.provider)
        : 'Email (SSO)'}
    </Button>
  );

  return (
    <Grid>
      {providers.map((provider) => (
        <GridCol
          key={provider.provider}
          span={{
            base: 12,
            xs: provider.provider != Provider.CREDENTIALS ? 6 : undefined,
          }}
        >
          {getButton(provider)}
        </GridCol>
      ))}
    </Grid>
  );
}

const providers = [
  {
    image: images.icons.credentials,
    provider: Provider.CREDENTIALS,
  },
  {
    image: images.icons.google,
    provider: Provider.GOOGLE,
  },
  {
    image: 'https://img.icons8.com/?size=100&id=16318&format=png&color=000000',
    provider: Provider.GITHUB,
  },
];
