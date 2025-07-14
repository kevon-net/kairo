import React from 'react';
import { Metadata } from 'next';
import PartialListingUpcoming from '@/components/partial/listings/upcoming';

export const metadata: Metadata = {
  title: 'Upcoming',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Upcoming() {
  return <PartialListingUpcoming />;
}
