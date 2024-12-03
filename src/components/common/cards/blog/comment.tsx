'use client';

import { CommentRelations } from '@/types/models/comment';
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
import CardBlogReplyComment from './reply/comment';
import { ReplyGet } from '@/types/models/reply';
import FormBlogReply from '@/components/form/blog/reply';
import { UserRelations } from '@/types/models/user';

interface Replies extends ReplyGet {
  replies?: ReplyGet[];
}

export default function Comment({
  props,
}: {
  props: Omit<CommentRelations, 'replies' | 'user' | 'post'> & {
    replies?: Replies[];
    user?: UserRelations;
  };
}) {
  const [mounted, setMounted] = useState(false);

  const name = props.user?.profile?.name || props.name || 'Anonymous';

  return (
    <Card bg={'transparent'} padding={0} py={'xl'}>
      <Stack>
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
                  Reply to {name}
                </Title>
                <Text>Your email address will not be published.</Text>
              </Stack>

              <FormBlogReply commentId={props.id} setMounted={setMounted} />
            </Stack>
          </Card>
        )}

        {props.replies && (
          <Grid gutter={0} pl={'xl'}>
            {props.replies.map((reply) => (
              <GridCol key={reply.id} span={12}>
                <Stack gap={0}>
                  <CardBlogReplyComment
                    props={{
                      ...reply,
                      user: props.user,
                      replies: reply.replies,
                    }}
                  />

                  {props.replies &&
                    props.replies.indexOf(reply) !=
                      props.replies.length! - 1 && <Divider />}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        )}
      </Stack>
    </Card>
  );
}
