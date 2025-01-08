import React from 'react';

import Link from 'next/link';

import {
  Anchor,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { PostRelations } from '@/types/models/post';

import { linkify } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import ImageDefault from '@/components/common/images/default';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Aside({ post }: { post: PostRelations }) {
  const path = `/blog/${linkify(post.title)}-${post.id}`;

  return (
    <Grid>
      <GridCol span={4}>
        <Anchor
          component={Link}
          underline="hover"
          inherit
          href={path}
          title={post.title}
        >
          <ImageDefault
            src={post.image}
            alt={post.title}
            height={80}
            radius={'sm'}
            mode="grid"
          />
        </Anchor>
      </GridCol>

      <GridCol span={8}>
        <Stack gap={'xs'}>
          <Stack gap={4}>
            <Title order={3} fz={'md'} lineClamp={1}>
              <Anchor
                component={Link}
                underline="hover"
                inherit
                href={path}
                c={'inherit'}
                title={post.title}
              >
                {post.title}
              </Anchor>
            </Title>

            <Text lineClamp={1} fz={'sm'}>
              {post.excerpt}
            </Text>
          </Stack>

          <Group gap={'xs'} fz={'xs'}>
            <Text inherit>{getRegionalDate(post.createdAt).date}</Text>

            <IconCircleFilled size={4} />

            <Anchor
              component={Link}
              href={`/blog/categories/${post.category?.id}`}
              underline="never"
              inherit
            >
              {post.category?.title}
            </Anchor>

            {post._count.comments && (
              <>
                <IconCircleFilled size={4} />

                <Group gap={4}>
                  <IconMessageCircle
                    size={ICON_SIZE - 4}
                    stroke={ICON_STROKE_WIDTH}
                  />

                  <NumberFormatter
                    thousandSeparator
                    value={post._count.comments}
                  />
                </Group>
              </>
            )}
          </Group>
        </Stack>
      </GridCol>
    </Grid>
  );
}
