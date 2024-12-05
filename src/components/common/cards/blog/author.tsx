import TextDate from '@/components/common/text/date';
import { Avatar, Card, Group, Stack, Title } from '@mantine/core';
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

          <TextDate date={props.date} fz={'sm'} c={'dimmed'} />
        </Stack>
      </Group>
    </Card>
  );
}
