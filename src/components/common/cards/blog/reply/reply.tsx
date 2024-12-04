import React from 'react';

import { ReplyRelations } from '@/types/models/reply';
import { getRegionalDate } from '@/utilities/formatters/date';
import { initialize } from '@/utilities/formatters/string';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';

export default function Reply({ props }: { props: ReplyRelations }) {
  const name = props.user?.profile?.name || props.name || 'Anonymous';

  return (
    <Card bg={'transparent'} padding={0}>
      <Stack gap={'xs'}>
        <Group gap={'xs'}>
          <Avatar size={32}>{initialize(name)}</Avatar>

          <Title order={3} fz={'md'}>
            {name}{' '}
            <Text component="span" fw={'normal'}>
              on {getRegionalDate(props.createdAt)}
            </Text>
          </Title>
        </Group>

        <Text fw={'normal'}>{props.content}</Text>
      </Stack>
    </Card>
  );
}
