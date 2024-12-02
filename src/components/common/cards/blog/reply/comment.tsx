'use client';

import { ReplyGet, ReplyRelations } from '@/types/models/reply';
import { getRegionalDate } from '@/utilities/formatters/date';
import { initialize } from '@/utilities/formatters/string';
import {
  Anchor,
  Avatar,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import FormBlogReply from '@/components/form/blog/reply';
import CardBlodReplyReply from './reply';
import { UserRelations } from '@/types/models/user';

export default function Comment({
  props,
}: {
  props: Omit<ReplyRelations, 'user'> & {
    user: UserRelations;
    replies?: ReplyGet[];
  };
}) {
  const [mounted, setMounted] = useState(false);

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

        <Group>
          <Anchor
            fw={'bold'}
            underline="always"
            onClick={() => setMounted(!mounted)}
          >
            {mounted ? 'Close' : 'Reply'}
          </Anchor>
        </Group>

        {mounted && (
          <Card
            p={{ base: 'xs', xs: 'xl' }}
            bg={'transparent'}
            withBorder
            shadow="xs"
          >
            <Stack gap={'xl'}>
              <Stack gap={'xs'}>
                <Title order={2} lh={1} fz={'xl'}>
                  Reply to {props.name}
                </Title>
                <Text>Your email address will not be published.</Text>
              </Stack>

              <FormBlogReply replyId={props.id} />
            </Stack>
          </Card>
        )}

        {props.replies && (
          <Grid gutter={0} pl={'xl'}>
            {props.replies.map((reply) => (
              <GridCol key={reply.id} span={12}>
                <Stack gap={0}>
                  <CardBlodReplyReply props={{ ...reply, user: props.user }} />

                  {props.replies &&
                    props.replies.indexOf(reply) !=
                      props.replies.length - 1 && <Divider />}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        )}
      </Stack>
    </Card>
  );
}
