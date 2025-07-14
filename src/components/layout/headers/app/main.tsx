import React from 'react';
import ImageDefault from '@/components/common/images/default';
import { images } from '@/assets/images';
import { Group } from '@mantine/core';
import IndicatorNetworkStatus from '@/components/indicators/network-status';
import { appName } from '@/data/app';

export default function Main() {
  return (
    <Group justify="space-between">
      <div>
        <ImageDefault
          src={images.brand.icon.default}
          height={40}
          width={40}
          alt={appName}
          fit="contain"
        />
      </div>

      <IndicatorNetworkStatus />
    </Group>
  );
}
