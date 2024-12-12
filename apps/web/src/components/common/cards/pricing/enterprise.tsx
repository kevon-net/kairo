'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@/data/constants';
import { Pricing as SwitchPricing } from '@repo/enums';

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import React from 'react';
import TooltipInfo from '../../tooltips/input/info';
import { roundAndTruncate } from '@repo/utils/helpers';
import { Discount } from '@/types/static';

interface Pricing {
  title: string;
  desc: string;
  price: { monthly: number; annually: number };
  specs: string[];
  meta?: { popular: boolean };
}

export default function Enterprise({
  props,
  options,
  functions,
}: {
  props: Pricing;
  options?: { period: SwitchPricing };
  functions?: { getDiscount: (prices: Discount) => number };
}) {
  const annual = options?.period == SwitchPricing.ANNUALLY;

  return (
    <Card
      withBorder
      bg={'transparent'}
      p={{ base: 'md', md: 'xs' }}
      h={'100%'}
      shadow="xs"
      style={{
        border: props.meta?.popular
          ? `2px solid var(--mantine-color-pri-6)`
          : undefined,
      }}
    >
      <Grid>
        <GridCol span={{ base: 12, md: 7 }} order={{ base: 2, md: 1 }}>
          <Box px={{ base: 0, md: 'xl' }} py={{ base: 0, md: 'xl' }}>
            <Stack gap={'xl'}>
              <Title order={2}>{props.title}</Title>

              <Text>{props.desc}</Text>

              <Divider
                label={
                  <Text
                    component="span"
                    fz={'md'}
                    fw={'bold'}
                    c={'pri.6'}
                    lh={1}
                  >
                    What&apos;s included
                  </Text>
                }
                labelPosition="left"
              />

              <Grid>
                {props.specs.map((spec, index) => (
                  <GridCol key={index} span={{ base: 12, md: 6 }}>
                    <Group>
                      <IconCheck
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                        color="var(--mantine-color-pri-6)"
                      />

                      <Text
                        component="span"
                        fz={{ md: 'xs', lg: 'sm', xl: 'md' }}
                      >
                        {spec}
                      </Text>
                    </Group>
                  </GridCol>
                ))}
              </Grid>
            </Stack>
          </Box>
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }} order={{ base: 1, md: 2 }}>
          <Card
            bg={'var(--mantine-color-gray-light)'}
            withBorder
            h={'100%'}
            px={{ md: 56, lg: SECTION_SPACING * 1.5 }}
          >
            <Stack justify="center" h={'100%'}>
              <Group justify="space-between" align="end">
                <Text fz={32} fw={'bolder'} lh={1.05}>
                  <NumberFormatter
                    prefix="$"
                    value={annual ? props.price.annually : props.price.monthly}
                    thousandSeparator
                  />{' '}
                  <Text component="span" inherit fz={'sm'} fw={'normal'}>
                    / month
                  </Text>{' '}
                </Text>

                <Group gap={'xs'}>
                  {annual && (
                    <Text
                      component="span"
                      inherit
                      fz={'sm'}
                      fw={'normal'}
                      c={'green'}
                      lh={1}
                    >
                      -{' '}
                      <NumberFormatter
                        prefix="$"
                        value={getDiscount({
                          initial: props.price.monthly * 12,
                          current: props.price.annually * 12,
                        })}
                        thousandSeparator
                        decimalScale={0}
                        style={{ fontWeight: 'bold' }}
                      />{' '}
                      %
                    </Text>
                  )}

                  <TooltipInfo
                    props={{
                      label: !annual
                        ? 'Billed monthly'
                        : `Save ${roundAndTruncate(
                            functions?.getDiscount({
                              initial: props.price.monthly * 12,
                              current: props.price.annually * 12,
                            }) || 0,
                            0
                          )}% on annual plan (billed annually)`,
                    }}
                    multiline={annual}
                    w={annual ? 200 : undefined}
                  />
                </Group>
              </Group>

              <Text
                component="span"
                inherit
                fz={'sm'}
                fw={'bold'}
                ta={'center'}
              >
                <NumberFormatter
                  prefix="$"
                  value={
                    annual
                      ? props.price.annually * 12
                      : props.price.monthly * 12
                  }
                  thousandSeparator
                />{' '}
                <Text component="span" inherit fz={'md'} fw={'normal'}>
                  / year
                </Text>
              </Text>

              <Button>Contact Sales</Button>

              <Text c="dimmed" fz={'sm'} ta={'center'}>
                Invoices and receipts available for easy company reimbursement
              </Text>
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </Card>
  );
}

const getDiscount = (prices: { initial: number; current: number }) =>
  ((prices.initial - prices.current) / prices.initial) * 100;
