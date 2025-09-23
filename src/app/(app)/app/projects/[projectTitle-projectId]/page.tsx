import React from 'react';
import PartialListingProject from '@/components/partial/listings/project';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function App() {
  return (
    <div>
      <PartialListingProject />
    </div>
  );
}
