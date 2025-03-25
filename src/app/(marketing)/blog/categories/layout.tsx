import React from 'react';

import { Metadata } from 'next';

import LayoutBody from '@/components/layout/body';

import appData from '@/data/app';

export const metadata: Metadata = {
  title: {
    default: 'Categories',
    template: `%s - Categories - Blog - ${appData.name.app}`,
  },
};

export default function LayoutCategories({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
