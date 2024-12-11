import React from 'react';

import { ReplyRelations } from '@repo/types/models';
import { initialize, getRegionalDate } from '@repo/utils/formatters';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';

export default function Reply({ props }: { props: ReplyRelations }) {
  const name = props.user?.profile?.name || props.name || 'Anonymous';

  return (
    <Card bg={'transparent'} padding={0}>
      <Stack gap={'xs'}>
        <Group gap={'xs'}>
          <Avatar size={40}>{initialize(name)}</Avatar>

          <Stack gap={0}>
            <Title order={3} fz={'md'}>
              {name}
            </Title>

            <Text fz={'sm'} c={'dimmed'}>
              <Text inherit component="span">
                {getRegionalDate(props.createdAt).date}
              </Text>{' '}
              at{' '}
              <Text inherit component="span">
                {getRegionalDate(props.createdAt).time}
              </Text>
            </Text>
          </Stack>
        </Group>

        <Text fw={'normal'}>{props.content}</Text>
      </Stack>
    </Card>
  );
}
