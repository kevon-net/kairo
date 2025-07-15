import React from 'react';
import { Metadata } from 'next';
import PartialListingTimeline from '@/components/partial/listings/timeline';

export const metadata: Metadata = {
  title: 'Timeline',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Timeline() {
  return <PartialListingTimeline />;
}
