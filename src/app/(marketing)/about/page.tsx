import React from 'react';

import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';

export const metadata: Metadata = { title: 'About' };

export default async function About() {
  return (
    <LayoutPage>
      <LayoutSection id={'page-about'} padded>
        About page
      </LayoutSection>
    </LayoutPage>
  );
}
