import React from 'react';
import LoadingMain from '@/components/partial/loading/main';
import ProviderMantine from '@/components/providers/mantine';

export default function Loading() {
  return (
    <ProviderMantine>
      <LoadingMain />
    </ProviderMantine>
  );
}
