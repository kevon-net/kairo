'use client';

import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import CardBlogReplyComment from './reply/comment';
import ModalReply from '@/components/common/modals/reply';
import { IconCircleFilled } from '@tabler/icons-react';
import { useFetchRepliesComment } from '@/hooks/fetch/replies/comment';
import { PostComment } from '@/types/static';
import { initialize } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';

export default function Comment({ props }: { props: PostComment }) {
  const { loading, data, fetch, comments } = useFetchRepliesComment({
    commentId: props.id,
  });

  const usersName =
    `${props.profile?.firstName || ''} ${props.profile?.lastName || ''}`.trim();
  const name = usersName || props.name || 'Anonymous';
  const comment = comments.find((comment) => comment.id == props.id);
  const replies = comment?.replies?.length || 0;

  return (
    <Card bg={'transparent'} padding={0}>
      <Stack gap={'lg'}>
        <Stack>
          <Group gap={'xs'}>
            <Avatar size={40}>{initialize(name)}</Avatar>

            <Stack gap={0}>
              <Title order={3} fz={'md'}>
                {name}
              </Title>

              <Text fz={'sm'} c={'dimmed'}>
                <Text component="span" inherit>
                  {getRegionalDate(props.createdAt).date}
                </Text>{' '}
                at{' '}
                <Text component="span" inherit>
                  {getRegionalDate(props.createdAt).time.toUpperCase()}
                </Text>
              </Text>
            </Stack>
          </Group>

          <Text fw={'normal'}>{props.content}</Text>

          <Group fz={'sm'} gap={'xs'}>
            <ModalReply props={{ name, commentId: props.id }}>
              <Button
                size="compact-sm"
                px={0}
                variant="transparent"
                color="pri.6"
              >
                Reply
              </Button>
            </ModalReply>

            {props._count &&
              props._count.replies > 0 &&
              (replies < props._count.replies || !data.length) && (
                <>
                  <IconCircleFilled size={4} />

                  <Button
                    size="compact-sm"
                    px={0}
                    variant="transparent"
                    color="gray"
                    rightSection={
                      <Text component="span" inherit>
                        (
                        <NumberFormatter
                          value={props._count.replies}
                          thousandSeparator
                        />
                        )
                      </Text>
                    }
                    onClick={fetch}
                    loading={loading}
                  >
                    View
                    {replies > 0 && !data.length ? ' More' : ''} Replies
                  </Button>
                </>
              )}
          </Group>
        </Stack>

        {props.replies && props.replies.length > 0 && (
          <Grid gutter={0} pl={'xl'}>
            {props.replies.map((reply) => (
              <GridCol key={reply.id} span={12}>
                <Stack gap={0}>
                  <CardBlogReplyComment props={reply} />

                  {props.replies &&
                    props.replies.indexOf(reply) !=
                      props.replies.length! - 1 && <Divider my={'lg'} />}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        )}
      </Stack>
    </Card>
  );
}
