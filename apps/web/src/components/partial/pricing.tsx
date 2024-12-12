'use client';

import { SECTION_SPACING } from '@/data/constants';
import { useSwitchPricing } from '@/hooks/switch/pricing';
import { Pricing as SwitchPricing } from '@repo/enums';
import { Grid, GridCol, Group, SegmentedControl, Stack } from '@mantine/core';
import React from 'react';
import CardPricingMain from '@/components/common/cards/pricing/main';
import { capitalizeWord } from '@repo/utils/formatters';
import CardPricingEnterprise from '../common/cards/pricing/enterprise';

export default function Pricing() {
  const { period, setPeriod, getDiscount } = useSwitchPricing();

  return (
    <Stack gap={SECTION_SPACING / 2}>
      <Group justify="center">
        <SegmentedControl
          color="pri"
          value={period}
          onChange={(v) => setPeriod(v as SwitchPricing)}
          data={[
            {
              label: capitalizeWord(SwitchPricing.MONTHLY),
              value: SwitchPricing.MONTHLY,
            },
            {
              label: capitalizeWord(SwitchPricing.ANNUALLY),
              value: SwitchPricing.ANNUALLY,
            },
          ]}
          style={{ alignSelf: 'center' }}
        />
      </Group>

      <Grid gutter={'xl'} grow>
        {tiers.map(
          (tier) =>
            tiers.indexOf(tier) != tiers.length - 1 && (
              <GridCol key={tier.title} span={{ base: 12, sm: 6, md: 4 }}>
                <CardPricingMain
                  props={tier}
                  options={{ period }}
                  functions={{ getDiscount }}
                />
              </GridCol>
            )
        )}

        <GridCol span={{ base: 12, sm: 6 }}>
          <CardPricingEnterprise
            props={tiers[tiers.length - 1]}
            options={{ period }}
            functions={{ getDiscount }}
          />
        </GridCol>
      </Grid>
    </Stack>
  );
}

const tiers = [
  {
    title: 'Hobby',
    desc: 'The essentials to provide your best work for yourself.',
    price: { monthly: 19, annually: 17 },
    specs: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics'],
  },
  {
    title: 'Freelancer',
    desc: 'The essentials to provide your best work for clients.',
    price: { monthly: 29, annually: 25 },
    specs: [
      '5 products',
      'Up to 1,000 subscribers',
      'Basic analytics',
      '48-hour support response time',
    ],
    meta: { popular: true },
  },
  {
    title: 'Startup',
    desc: 'A plan that scales with your rapidly growing business.',
    price: { monthly: 59, annually: 49 },
    specs: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
      'Marketing automations',
    ],
  },
  {
    title: 'Enterprise',
    desc: 'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
    price: { monthly: 99, annually: 79 },
    specs: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support response time',
      'Marketing automations',
      'Custom reporting tools',
    ],
  },
];
