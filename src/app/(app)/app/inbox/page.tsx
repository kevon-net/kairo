import React from 'react';
import { Metadata } from 'next';
import PartialListingInbox from '@/components/partial/listings/inbox';

export const metadata: Metadata = {
  title: 'Inbox',
};

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default function Inbox() {
  return <PartialListingInbox />;
}
