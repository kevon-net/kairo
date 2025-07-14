import React from 'react';
import { Metadata } from 'next';
import PartialListingHome from '@/components/partial/listings/home';

export const metadata: Metadata = {
  title: 'Inbox',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Home() {
  return <PartialListingHome />;
}
