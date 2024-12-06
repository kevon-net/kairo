'use client';

import { SessionGet } from '@/types/models/session';
import { capitalizeWord } from '@/utilities/formatters/string';
import {
  Badge,
  Card,
  CardSection,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import ModalDeleteSession from '../modals/delete/session';
import { useAppSelector } from '@/hooks/redux';
import { getRegionalDate } from '@/utilities/formatters/date';

export default function Session({ props }: { props: SessionGet }) {
  const session = useAppSelector((state) => state.session.value);

  const data = [
    {
      label: 'IP',
      value: props.ip,
    },
    {
      label: 'Location',
      value: `${props.city}, ${props.country}`,
    },
    {
      label: 'Last Active',
      value: getRegionalDate(props.updatedAt).date,
    },
  ];

  return (
    <Card withBorder bg={'transparent'} shadow="xs">
      <Stack>
        <Group justify="space-between" align="end">
          <Group gap={'xs'} align="start">
            <Title order={2} fz={'lg'} my={0} lh={1}>
              {capitalizeWord(props.os!)}
            </Title>

            {session?.id == props.id && (
              <Badge size="sm" variant="light" color="blue.6" radius={'sm'}>
                current
              </Badge>
            )}
          </Group>

          <ModalDeleteSession props={props} />
        </Group>

        <CardSection>
          <Divider />
        </CardSection>

        <Stack gap={4} fz={'sm'} fw={'bold'}>
          {data.map((item) => (
            <Group
              key={item.label}
              grow
              preventGrowOverflow={false}
              wrap="nowrap"
              align="end"
              gap={'xs'}
            >
              <Text inherit>{item.label}:</Text>

              <Divider variant="dashed" pb={5} />

              <Text component="span" inherit fw={'normal'} ta={'end'}>
                {item.value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
