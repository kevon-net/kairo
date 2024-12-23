import React from 'react';

import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intro/page';

import appData from '@/data/app';

export const metadata: Metadata = { title: 'About' };

export default async function About() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `About ${appData.name.company}`,
          title: 'Empowering the World to Design',
          desc: `We are ${appData.name.company}, a Digital Product Design & Branding Agency. As a team of Designers, Business Analysts, Strategists, Content Writers, and Project Managers, we collaborate on a result-oriented design process.`,
        }}
      />
    </LayoutPage>
  );
}
