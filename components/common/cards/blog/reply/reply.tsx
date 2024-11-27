import React from 'react';

import { ReplyReplyGet } from '@/types/models/reply';
import { getRegionalDate } from '@/utilities/formatters/date';
import { initialize } from '@/utilities/formatters/string';
import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';

export default function Reply({ props }: { props: ReplyReplyGet }) {
  return (
    <Card bg={'transparent'} padding={0} py={'md'}>
      <Stack>
        <Group gap={'xs'}>
          <Avatar size={32}>{initialize(props.name)}</Avatar>

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
