import React from 'react';

import { ReplyRelations } from '@/types/models/reply';
import { initialize } from '@/utilities/formatters/string';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import TextDate from '@/components/common/text/date';

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
              <TextDate date={props.createdAt} inherit /> at{' '}
              <TextDate
                date={props.createdAt}
                options={{ return: 'time' }}
                inherit
              />
            </Text>
          </Stack>
        </Group>

        <Text fw={'normal'}>{props.content}</Text>
      </Stack>
    </Card>
  );
}
