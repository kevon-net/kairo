'use client';

import { Loader, Stack, Text, Transition } from '@mantine/core';
import React, { useEffect, useState } from 'react';
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
        alt={appName}
        height={{ base: 64 }}
        fit="contain"
        mode="grid"
      />

      <Loader color="pri" type="dots" />

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
