import React from 'react';
import LayoutBody from '@/components/layout/body';
import { Metadata } from 'next';
import { appName } from '@/data/app';

export interface typeParams {
  'projectTitle-projectId': string;
}

export const metadata: Metadata = {
  title: {
    default: 'Projects',
    template: `%s - Projects - ${appName}`,
  },
};

export default function LayoutAppProjects({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
