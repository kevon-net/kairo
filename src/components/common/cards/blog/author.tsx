import { PostRelations } from '@/types/models/post';
import { Avatar, Card, Group, Title } from '@mantine/core';
import React from 'react';

export default function Author({ props }: { props: PostRelations['profile'] }) {
  const fullName =
    `${props?.first_name || ''} ${props?.last_name || ''}`.trim();

  return (
    <Card padding={0} bg={'transparent'}>
      <Group>
        <Avatar
          size={48}
          src={props?.avatar}
          name={fullName}
          color={'initials'}
        />

        <Title order={3} fz={'md'}>
          {fullName || 'Anonymous'}
        </Title>
      </Group>
    </Card>
  );
}
