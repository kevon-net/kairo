import React from 'react';

import { ReplyRelations } from '@/types/models/reply';
import { initialize } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';

export default function Reply({ props }: { props: ReplyRelations }) {
  const usersName =
    `${props.profile?.first_name || ''} ${props.profile?.last_name || ''}`.trim();
  const name = usersName || props.name || 'Anonymous';

  return (
    <Card bg={'transparent'} padding={0}>
      <Stack gap={'xs'}>
        <Group gap={'xs'}>
          <Avatar size={40} src={props.profile?.avatar}>
            {initialize(name)}
          </Avatar>

          <Stack gap={0}>
            <Title order={3} fz={'md'}>
              {name}
            </Title>

            <Text fz={'sm'} c={'dimmed'}>
              <Text inherit component="span">
                {getRegionalDate(props.created_at).date}
              </Text>{' '}
              at{' '}
              <Text inherit component="span">
                {getRegionalDate(props.created_at).time.toUpperCase()}
              </Text>
            </Text>
          </Stack>
        </Group>

        <Text fw={'normal'}>{props.content}</Text>
      </Stack>
    </Card>
  );
}
