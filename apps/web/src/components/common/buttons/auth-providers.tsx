'use client';

import React, { useState } from 'react';

import { Button, Grid, GridCol } from '@mantine/core';

import images from '@/data/images';
import { capitalizeWords } from '@repo/utils/formatters';
import { useOs } from '@mantine/hooks';
import { Provider } from '@repo/schemas/node_modules/@prisma/client';
import ImageDefault from '@/components/common/images/default';
import { COOKIE_NAME } from '@/data/constants';
import { getUrlParam, setCookie } from '@repo/utils/helpers';

export default function Providers() {
  const [loading, setLoading] = useState('');
  const os = useOs();

  const getButton = (provider: { image: string; provider: Provider }) => (
    <Button
      key={provider.provider}
      fullWidth
      variant="default"
      onClick={async () => {
        setLoading(provider.provider);
        setCookie(COOKIE_NAME.DEVICE.OS, { os }, { expiryInSeconds: 15 * 60 });
        window.location.href = `/api/auth/sign-in/google?redirect=${encodeURIComponent(getUrlParam('redirect'))}`;
      }}
      loading={loading == provider.provider}
      leftSection={
        <ImageDefault
          src={provider.image}
          alt={provider.provider}
          height={24}
          width={24}
          mode="grid"
        />
      }
    >
      {provider.provider != Provider.CREDENTIALS
        ? capitalizeWords(provider.provider)
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
