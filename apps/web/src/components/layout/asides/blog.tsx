import React from 'react';

import LayoutSection from '@/components/layout/section';
import CardBlogAside from '@/components/common/cards/blog/aside';
import { postsGet } from '@/handlers/requests/database/post';
import {
  Anchor,
  Badge,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import {
  PostRelations,
  CategoryRelations,
  TagRelations,
} from '@repo/types/models';
import { categoriesGet } from '@/handlers/requests/database/category';
import { tagsGet } from '@/handlers/requests/database/tag';
import { typeParams } from '@/app/(marketing)/blog/layout';

export default async function Blog({ params }: { params: typeParams }) {
  const [postId] = params['postId-postTitle'].split('-');

  const { posts }: { posts: PostRelations[] } = await postsGet();
  const { tags }: { tags: TagRelations[] } = await tagsGet();
  const { categories }: { categories: CategoryRelations[] } =
    await categoriesGet();

  const postsFiltered = posts.filter((p) => p.id != postId);

  return (
    <LayoutSection
      id={'partial-aside-blog'}
      padded
      containerized={false}
      pos={'sticky'}
      top={32}
    >
      <Stack gap={'xl'}>
        <Stack>
          <Title order={2} fz={'xl'}>
            Categories
          </Title>

          <Stack gap={'xs'}>
            {categories.map((c) => (
              <Stack key={c.id}>
                {categories.indexOf(c) != 0 && <Divider />}

                <Anchor
                  component={Link}
                  href={`/blog/categories/${c.id}`}
                  underline="never"
                  c={'gray'}
                >
                  <Group justify="space-between" fz={'sm'}>
                    <Text inherit>{c.title}</Text>

                    <Text inherit ta={'end'}>
                      <NumberFormatter
                        value={c._count.posts}
                        thousandSeparator
                      />
                    </Text>
                  </Group>
                </Anchor>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack>
          <Title order={2} fz={'xl'}>
            Recent Posts
          </Title>

          <Grid>
            {postsFiltered.map(
              (post) =>
                postsFiltered.indexOf(post) < 3 && (
                  <GridCol key={post.id} span={12}>
                    <Stack>
                      {postsFiltered.indexOf(post) != 0 && <Divider />}
                      <CardBlogAside post={post} />
                    </Stack>
                  </GridCol>
                )
            )}
          </Grid>
        </Stack>

        <Stack>
          <Title order={2} fz={'xl'}>
            Tags
          </Title>

          <Group gap={'xs'}>
            {tags.map((t) => (
              <Anchor
                key={t.id}
                component={Link}
                href={`/blog/tags/${t.id}`}
                underline="never"
              >
                <Badge
                  style={{ cursor: 'inherit' }}
                  radius={'sm'}
                  tt={'capitalize'}
                  rightSection={
                    <Text component="span" inherit>
                      (
                      <NumberFormatter
                        value={t._count.posts}
                        thousandSeparator
                      />
                      )
                    </Text>
                  }
                >
                  {t.title}
                </Badge>
              </Anchor>
            ))}
          </Group>
        </Stack>
      </Stack>
    </LayoutSection>
  );
}
