'use client';

import React, { useState } from 'react';

import LayoutSection from '../layout/section';
import {
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { commentsGet } from '@/handlers/requests/database/comment';
import { PostRelations } from '@/types/models/post';
import FormBlogComment from '@/components/form/blog/comment';
import CardBlogComment from '@/components/common/cards/blog/comment';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateComments } from '@/libraries/redux/slices/comments';

export default function Comments({
  props,
}: {
  props: { post: PostRelations };
}) {
  const comments = useAppSelector((state) => state.comments.value);
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<'loading' | 'success' | null>(null);

  const fetchComments = async () => {
    setStatus('loading');

    const result = await commentsGet({ postId: props.post.id });

    dispatch(updateComments(result.comments));

    setStatus('success');
  };

  return (
    <div>
      {(status == null || status == 'loading') &&
        props.post._count.comments > 0 && (
          <LayoutSection id={'page-post-comment'} padded containerized={'sm'}>
            <Button
              variant="default"
              fullWidth
              onClick={fetchComments}
              loading={status == 'loading'}
            >
              Show Comments ({props.post._count.comments || 0})
            </Button>
          </LayoutSection>
        )}

      {status == 'success' && (
        <LayoutSection
          id={'page-post-comment'}
          margined
          mb={'md'}
          containerized={'sm'}
        >
          <Title order={2}>Comments</Title>

          <Grid gutter={0}>
            {comments.map((comment) => (
              <GridCol key={comment.id} span={12}>
                <Stack gap={0}>
                  <CardBlogComment props={comment} />

                  {comments.indexOf(comment) != comments.length - 1 && (
                    <Divider />
                  )}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        </LayoutSection>
      )}

      {(status == 'success' || props.post._count.comments < 1) && (
        <LayoutSection
          id={'page-post-comment-form'}
          mt={props.post._count.comments < 1 ? undefined : 'md'}
          margined
          containerized={'sm'}
        >
          <Card
            p={{ base: 'xs', xs: 'xl' }}
            bg={'transparent'}
            withBorder
            shadow="xs"
          >
            <Stack gap={'xl'}>
              <Stack gap={'xs'}>
                <Title order={2} lh={1} fz={'xl'}>
                  {props.post._count.comments < 1
                    ? 'Be the first to'
                    : 'Leave a'}{' '}
                  Comment
                </Title>
                <Text>Your email address will not be published.</Text>
              </Stack>

              <FormBlogComment postId={props.post.id} />
            </Stack>
          </Card>
        </LayoutSection>
      )}
    </div>
  );
}
