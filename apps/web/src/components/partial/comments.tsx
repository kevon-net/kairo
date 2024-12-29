'use client';

import React from 'react';

import LayoutSection from '../layout/section';
import {
  Button,
  Card,
  Divider,
  Grid,
  GridCol,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import FormBlogComment from '@/components/form/blog/comment';
import CardBlogComment from '@/components/common/cards/blog/comment';
import { useFetchComments } from '@/hooks/fetch/comments';
import { PostRelations } from '@/types/static';

export default function Comments({
  props,
}: {
  props: { post: PostRelations };
}) {
  const { loading, fetch, comments } = useFetchComments({
    postId: props.post.id,
  });

  return (
    <div>
      {(props.post._count.comments > 0 || loading) && !comments.length && (
        <LayoutSection id={'page-post-comment'} margined containerized={'sm'}>
          <Button variant="default" fullWidth onClick={fetch} loading={loading}>
            Show Comments (
            <NumberFormatter
              value={props.post._count.comments}
              thousandSeparator
            />
            )
          </Button>
        </LayoutSection>
      )}

      {((props.post._count.comments > 0 && comments.length > 0) ||
        comments.length > 0) && (
        <LayoutSection id={'page-post-comment'} margined containerized={'sm'}>
          <Title order={2}>Comments</Title>

          <Grid gutter={0} mt={'xl'}>
            {comments.map((comment) => (
              <GridCol key={comment.id} span={12}>
                <Stack gap={0}>
                  <CardBlogComment
                    props={{
                      ...comment,
                      replies: comment.replies,
                      profile: comment.profile!,
                    }}
                  />

                  {comments.indexOf(comment) != comments.length - 1 && (
                    <Divider my={'lg'} />
                  )}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        </LayoutSection>
      )}

      {(!props.post._count.comments || comments.length > 0) && (
        <LayoutSection
          id={'page-post-comment-form'}
          margined
          containerized={'sm'}
        >
          <Card
            padding={0}
            // p={{ base: 'xs', xs: 'xl' }}
            bg={'transparent'}
            // withBorder
            // shadow="xs"
          >
            <Stack gap={'xl'}>
              <Stack gap={'xs'}>
                <Title order={2} lh={1} fz={'xl'}>
                  {comments.length < 1 ? 'Be the first to' : 'Leave a'} Comment
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
