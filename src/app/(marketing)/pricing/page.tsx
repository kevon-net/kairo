import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pricing' };

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import IntroPage from '@/components/layout/intro/page';
import IntroSection from '@/components/layout/intro/section';
import PartialPricing from '@/components/partial/pricing';
import CarouselPartners from '@/components/common/carousels/partners';
import AccordionFaq from '@/components/common/accordions/faq';

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

      <LayoutSection
        id={'page-pricing-partners'}
        bg={
          'light-dark(var(--mantine-color-pri-light), var(--mantine-color-gray-light))'
        }
        padded
      >
        <CarouselPartners />
      </LayoutSection>

      <LayoutSection id={'page-pricing-faq'} padded containerized={'md'}>
        <IntroSection
          props={{
            title: `Frequently Asked Questions`,
            desc: "Have a different question and can't find the answer you're looking for? Reach out to our support team by sending us an email and we'll get back to you as soon as we can.",
          }}
          options={{ spacing: true }}
        />

        <AccordionFaq />
      </LayoutSection>
    </LayoutPage>
  );
}
