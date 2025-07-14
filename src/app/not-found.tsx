import React from 'react';
import Error404 from '@/components/partial/errors/404';
import ProviderMantine from '@/components/providers/mantine';

export default function NotFound() {
  return (
    <ProviderMantine>
      <Error404 />
    </ProviderMantine>
  );
}
