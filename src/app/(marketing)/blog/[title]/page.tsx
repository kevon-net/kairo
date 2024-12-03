import React from 'react';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';

import { typeParams } from '../layout';
import { PostRelations } from '@/types/models/post';
import { postsGet } from '@/handlers/requests/database/post';
import { linkify } from '@/utilities/formatters/string';
import {
  Anchor,
  Card,
  Center,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { getRegionalDate } from '@/utilities/formatters/date';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import MenuShare from '@/components/common/menus/share';
import Link from 'next/link';
import FormBlogComment from '@/components/form/blog/comment';
import CardBlogComment from '@/components/common/cards/blog/comment';
import IntroPage from '@/components/layout/intro/page';
import { iconSize, iconStrokeWidth } from '@/data/constants';
import CardBlogAuthor from '@/components/common/cards/blog/author';
import WrapperComments from '@/components/wrapper/comments';
import ImageDefault from '@/components/common/images/default';

export default async function Post({ params }: { params: typeParams }) {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  const post: (PostRelations & { user: any }) | undefined = posts.find(
    (p) => linkify(p.title) == params.title
  );

  return !post ? null : (
    <LayoutPage>
      <IntroPage props={{ title: post.title || '' }} />

      <LayoutSection id={'page-post'} margined mb={0} containerized={'sm'}>
        <Stack gap={'xl'}>
          <Flex
            direction={{ base: 'column', xs: 'row' }}
            align={'center'}
            justify={{ xs: 'center' }}
            gap={'md'}
            fz={'sm'}
          >
            <Group justify="center">
              <Text inherit>{getRegionalDate(post.createdAt)}</Text>

              <IconCircleFilled size={4} />

              <Anchor
                component={Link}
                href={`/blog/categories/${post.category?.id}`}
                underline="never"
                inherit
              >
                {post.category?.title}
              </Anchor>
            </Group>

            <Center visibleFrom="xs">
              <IconCircleFilled size={4} />
            </Center>

            <Group justify="center">
              <MenuShare props={{ postTitle: post.title }} />

              <IconCircleFilled size={4} />

              <Anchor inherit href="#page-post-comment">
                <Group gap={6}>
                  <IconMessageCircle
                    size={iconSize - 4}
                    stroke={iconStrokeWidth}
                  />

                  <Text component="span" inherit>
                    {post.comments.length}
                  </Text>
                </Group>
              </Anchor>
            </Group>
          </Flex>

          <ImageDefault
            src={post.image}
            alt={post.title}
            height={{ base: 240, xs: 320, md: 360, lg: 400 }}
            radius={'sm'}
            priority
          />

          <Text>{post.content}</Text>

          <Group justify="space-between" mt={'xl'}>
            <CardBlogAuthor
              props={{
                name: !post.user ? 'Anonymous' : post.user.profile.name,
                date: post.createdAt,
              }}
            />

            <Text fw={'bold'}>
              Tags:{' '}
              <Text component="span" inherit fw={'normal'}>
                {post.tags.map(
                  (t) =>
                    `${t.title}${post.tags.indexOf(t) == post.tags.length - 1 ? '' : ', '}`
                )}
              </Text>
            </Text>
          </Group>

          <Divider />
        </Stack>
      </LayoutSection>

      <WrapperComments props={{ comments: post.comments.length }}>
        <LayoutSection
          id={'page-post-comment'}
          margined
          mb={'md'}
          containerized={'sm'}
        >
          <Title order={2}>Comments</Title>

          <Grid gutter={0}>
            {post.comments.map((comment) => (
              <GridCol key={comment.id} span={12}>
                <Stack gap={0}>
                  <CardBlogComment props={comment} />

                  {post.comments.indexOf(comment) !=
                    post.comments.length - 1 && <Divider />}
                </Stack>
              </GridCol>
            ))}
          </Grid>
        </LayoutSection>

        <LayoutSection
          id={'page-post-comment'}
          mt={'md'}
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
                  Leave a Comment
                </Title>
                <Text>Your email address will not be published.</Text>
              </Stack>

              <FormBlogComment postId={post.id} />
            </Stack>
          </Card>
        </LayoutSection>
      </WrapperComments>
    </LayoutPage>
  );
}
