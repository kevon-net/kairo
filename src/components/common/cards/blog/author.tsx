import { getRegionalDate } from '@/utilities/formatters/date';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';

export default function Author({
  props,
}: {
  props: { image?: string; name: string; date: Date };
}) {
  return (
    <Card padding={0} bg={'transparent'}>
      <Group>
        <Avatar
          size={48}
          src={props.image || null}
          name={props.name}
          color={'initials'}
        />

        <Stack gap={0}>
          <Title order={3} fz={'md'}>
            {props.name}
          </Title>

          <Text fz={'sm'} c={'dimmed'}>
            {getRegionalDate(props.date).date}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
}
