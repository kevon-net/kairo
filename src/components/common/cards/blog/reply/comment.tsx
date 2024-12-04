'use client';

import { getRegionalDate } from '@/utilities/formatters/date';
import { initialize } from '@/utilities/formatters/string';
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
import CardBlodReplyReply from './reply';
import ModalReply from '@/components/common/modals/reply';
import { useFetchRepliesReply } from '@/hooks/fetch/replies/reply';
import { IconCircleFilled } from '@tabler/icons-react';
import { PostCommentReply } from '@/types/static';

export default function Comment({ props }: { props: PostCommentReply }) {
  const { loading, fetch, replies } = useFetchRepliesReply({
    replyId: props.id,
  });

  const name = props.user?.profile?.name || props.name || 'Anonymous';

  const commentReply = replies?.find(
    (commentReply) => commentReply.id == props.id
  );
  const commentReplyReplies = commentReply?.replies;

  return (
    <Card bg={'transparent'} padding={0}>
      <Stack gap={'lg'}>
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

          <Group fz={'sm'} gap={4}>
            <ModalReply props={{ name, replyId: props.id }}>
              <Button size="compact-xs" variant="transparent" color="pri.6">
                Reply
              </Button>
            </ModalReply>

            {props._count &&
              props._count.replies > 0 &&
              !commentReplyReplies?.length && (
                <>
                  <IconCircleFilled size={4} />

                  <Button
                    size="compact-xs"
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
                    View Replies
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
                  <CardBlodReplyReply props={reply} />

                  {props.replies &&
                    props.replies.indexOf(reply) !=
                      props.replies.length - 1 && <Divider my={'lg'} />}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        )}
      </Stack>
    </Card>
  );
}
