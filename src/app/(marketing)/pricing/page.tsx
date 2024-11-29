import React from 'react';

import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import IntroPage from '@/components/layout/intro/page';
import PartialPricing from '@/components/partial/pricing';
export const metadata: Metadata = { title: 'Pricing' };

export default async function Pricing() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          title: 'Pricing that grows with you',
          desc: "Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.",
        }}
      />

      <LayoutSection id={'page-contact'} margined>
        <PartialPricing />
      </LayoutSection>
    </LayoutPage>
  );
}
