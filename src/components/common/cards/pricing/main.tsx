'use client';

import { iconSize, iconStrokeWidth } from '@/data/constants';
import { SwitchPricing } from '@/types/enums';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  List,
  ListItem,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import React from 'react';
import TooltipInfo from '../../tooltips/input/info';

interface Pricing {
  title: string;
  desc: string;
  price: { monthly: number; annually: number };
  specs: string[];
  meta?: { popular: boolean };
}

export default function Main({
  props,
  options,
}: {
  props: Pricing;
  options?: { period: SwitchPricing };
}) {
  const annual = options?.period == SwitchPricing.ANNUALLY;

  return (
    <Card
      withBorder
      bg={'transparent'}
      p={{ base: 'md', md: 'xl' }}
      h={'100%'}
      shadow="xs"
      style={{
        border: props.meta?.popular
          ? `2px solid var(--mantine-color-pri-6)`
          : undefined,
      }}
    >
      <Stack>
        <Group justify="space-between">
          <Title order={2} fz={'lg'}>
            {props.title}
          </Title>
          {props.meta?.popular && (
            <Badge radius={'sm'} variant="light">
              most popular
            </Badge>
          )}
        </Group>

        <Text>{props.desc}</Text>

        <Group justify="space-between" align="end">
          <Text fz={32} fw={'bolder'} lh={1.05}>
            <NumberFormatter
              prefix="$"
              value={annual ? props.price.annually : props.price.monthly}
              thousandSeparator
            />{' '}
            <Text component="span" inherit fz={'sm'} fw={'normal'}>
              / month
            </Text>
          </Text>

          <Group gap={'xs'}>
            {annual && (
              <Text
                component="span"
                inherit
                fz={{ base: 'xs', lg: 'sm' }}
                fw={'normal'}
                c={'green'}
                lh={1}
              >
                <NumberFormatter
                  prefix="- $"
                  value={getDiscount({
                    initial: props.price.monthly * 12,
                    current: props.price.annually * 12,
                  })}
                  thousandSeparator
                  decimalScale={2}
                  style={{ fontWeight: 'bold' }}
                />{' '}
                %
              </Text>
            )}

            <TooltipInfo
              props={{
                label: annual
                  ? 'Billed annually'
                  : 'Switch to annual billing for a discount',
              }}
              multiline
              w={160}
            />
          </Group>
        </Group>

        <Divider />

        <Text component="span" inherit fz={'sm'} fw={'bold'} ta={'center'}>
          <NumberFormatter
            prefix="$"
            value={
              annual ? props.price.annually * 12 : props.price.monthly * 12
            }
            thousandSeparator
          />{' '}
          <Text component="span" inherit fz={'md'} fw={'normal'}>
            / year
          </Text>
        </Text>

        <Button
          fullWidth
          variant={props.meta?.popular ? undefined : 'light'}
          color={props.meta?.popular ? undefined : 'pri.6'}
        >
          {props.title == 'Enterprise' ? 'Contact Us' : 'Purchase'}
        </Button>

        <List
          fz={{ md: 'xs', lg: 'sm', xl: 'md' }}
          spacing={'xs'}
          icon={
            <IconCheck
              size={iconSize}
              stroke={iconStrokeWidth}
              color="var(--mantine-color-pri-6)"
            />
          }
        >
          {props.specs.map((spec, index) => (
            <ListItem key={index}>{spec}</ListItem>
          ))}
        </List>
      </Stack>
    </Card>
  );
}

const getDiscount = (prices: { initial: number; current: number }) =>
  ((prices.initial - prices.current) / prices.initial) * 100;
