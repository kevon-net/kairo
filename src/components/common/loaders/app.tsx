'use client';

import { Stack, Text, Transition } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import SpinnerApp from '../spinners/app';
import ImageDefault from '../images/default';
import { images } from '@/assets/images';
import { appName } from '@/data/app';

export default function Main() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 5000);
  }, []);

  return (
    <Stack align="center">
      <ImageDefault
        src={images.brand.icon.default}
        height={80}
        width={80}
        alt={appName}
        fit="contain"
      />

      <SpinnerApp />

      <Transition
        mounted={mounted}
        transition="fade"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <div style={styles}>
            <Text inherit fz={'xs'} ta={'center'}>
              This is taking longer than expected
              <br />
              you might be on a slow network
            </Text>
          </div>
        )}
      </Transition>
    </Stack>
  );
}
