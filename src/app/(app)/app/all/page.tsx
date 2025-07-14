import React from 'react';
import { Metadata } from 'next';
import PartialListingAll from '@/components/partial/listings/all';

export const metadata: Metadata = {
  title: 'All',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function All() {
  return <PartialListingAll />;
}
