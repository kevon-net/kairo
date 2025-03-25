import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';

import appData from '@/data/app';

export const metadata: Metadata = {
  title: {
    default: 'Tags',
    template: `%s - Tags - Blog - ${appData.name.app}`,
  },
};

export default function LayoutTags({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
