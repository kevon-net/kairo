'use client';

import React, { useState } from 'react';

import NextImage from 'next/image';

import { Button, Group, Image, Stack } from '@mantine/core';

import images from '@/data/images';
import { capitalizeWords } from '@/utilities/formatters/string';
import { useOs } from '@mantine/hooks';
import { signIn } from '@/handlers/events/auth';
import { Provider } from '@prisma/client';

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
        await signIn(provider.provider, undefined, { os });
      }}
      loading={loading == provider.provider}
      leftSection={
        <Group>
          <Image
            src={provider.image}
            alt={provider.provider}
            h={{ base: 24 }}
            component={NextImage}
            width={1920}
            height={1080}
            priority
          />
        </Group>
      }
    >
      Continue with {capitalizeWords(provider.provider)}
    </Button>
  );

  return <Stack>{providers.map((provider) => getButton(provider))}</Stack>;
}

const providers = [
  {
    image: images.icons.google,
    provider: Provider.GOOGLE,
  },
  {
    image: 'https://img.icons8.com/?size=100&id=16318&format=png&color=000000',
    provider: Provider.GITHUB,
  },
];
