import React from 'react';
import { Metadata } from 'next';
import PartialListingComplete from '@/components/partial/listings/complete';

export const metadata: Metadata = {
  title: 'Completed',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Completed() {
  return <PartialListingComplete />;
}
