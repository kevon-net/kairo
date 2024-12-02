import React from 'react';

import { ReplyGet } from '@/types/models/reply';
import { getRegionalDate } from '@/utilities/formatters/date';
import { initialize } from '@/utilities/formatters/string';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import { UserRelations } from '@/types/models/user';

export default function Reply({
  props,
}: {
  props: Omit<ReplyGet, 'user'> & { user: UserRelations };
}) {
  return (
    <Card bg={'transparent'} padding={0} py={'md'}>
      <Stack>
        <Group gap={'xs'}>
          <Avatar size={32}>
            {initialize(props.user.profile?.name || props.name || 'Anonymous')}
          </Avatar>

          <Title order={3} fz={'md'}>
            {props.name}{' '}
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
