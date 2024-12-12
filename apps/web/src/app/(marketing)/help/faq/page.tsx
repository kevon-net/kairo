import React from 'react';

import { Metadata } from 'next';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import IntroPage from '@/components/layout/intro/page';
import IntroSection from '@/components/layout/intro/section';
import AccordionFaq from '@/components/common/accordions/faq';
import CardCtaFaq from '@/components/common/cards/cta/faq';

import { Box, Grid, GridCol } from '@mantine/core';
import { SECTION_SPACING } from '@/data/constants';

export const metadata: Metadata = { title: 'FAQ' };

export default async function Faq() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Q & A`,
          title: 'Frequently Asked Questions',
          desc: `Need a help with something? Here are our most frequently asked questions.`,
        }}
      />

      <LayoutSection id={'page-faq'} margined>
        <Grid>
          <GridCol span={{ base: 12, sm: 4.5 }}>
            <Box pos={'sticky'} top={SECTION_SPACING} pr={{ md: 'xl' }}>
              <IntroSection
                props={{
                  title: `General`,
                  desc: "Can't find the answer you're looking for? Reach out to our customer support team.",
                }}
                options={{ alignment: 'start' }}
              />
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, sm: 7.5 }}>
            <AccordionFaq />
          </GridCol>
        </Grid>
      </LayoutSection>

      <LayoutSection id={'page-faq-billing'} margined>
        <Grid>
          <GridCol span={{ base: 12, sm: 4.5 }}>
            <Box pos={'sticky'} top={SECTION_SPACING} pr={{ md: 'xl' }}>
              <IntroSection
                props={{
                  title: `Billing`,
                  desc: "Have a different question and can't find the answer you're looking for? Reach out to our support team by sending us an email and we'll get back to you as soon as we can.",
                }}
                options={{ alignment: 'start' }}
              />
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, sm: 7.5 }}>
            <AccordionFaq />
          </GridCol>
        </Grid>
      </LayoutSection>

      <LayoutSection id={'page-faq-cta'} margined>
        <CardCtaFaq />
      </LayoutSection>
    </LayoutPage>
  );
}
