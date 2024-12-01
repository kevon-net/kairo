import React from 'react';

import LayoutSection from '@/components/layout/section';
import CardBlogAside from '@/components/common/cards/blog/aside';
import { PostRelations } from '@/types/models/post';
import { postsGet } from '@/handlers/requests/database/post';
import {
  Anchor,
  Badge,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { CategoryRelations } from '@/types/models/category';
import { categoriesGet } from '@/handlers/requests/database/category';
import { linkify } from '@/utilities/formatters/string';
import { TagRelations } from '@/types/models/tag';
import { tagsGet } from '@/handlers/requests/database/tag';

export default async function Blog({ params }: { params: { title: string } }) {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  const { tags }: { tags: TagRelations[] } = await tagsGet();
  const { categories }: { categories: CategoryRelations[] } =
    await categoriesGet();

  const postsTrimmed = posts.filter((p) => linkify(p.title) != params.title);

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
                      {c.posts.length}
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
            {postsTrimmed.map(
              (post) =>
                postsTrimmed.indexOf(post) < 3 && (
                  <GridCol key={post.id} span={12}>
                    <Stack>
                      {postsTrimmed.indexOf(post) != 0 && <Divider />}
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
