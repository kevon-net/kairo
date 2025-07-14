import React from 'react';
import { Metadata } from 'next';
import PartialListingToday from '@/components/partial/listings/today';

export const metadata: Metadata = {
  title: 'Today',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Today() {
  return <PartialListingToday />;
}
