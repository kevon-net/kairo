import React from 'react';

import Link from 'next/link';
import NextImage from 'next/image';

import {
  Anchor,
  Grid,
  GridCol,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { PostRelations } from '@/types/models/post';

import { linkify } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';
import { IconCircleFilled } from '@tabler/icons-react';

export default function Aside({ post }: { post: PostRelations }) {
  const path = `/blog/${linkify(post.title)}`;

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
          <Group
            style={{
              overflow: 'hidden',
              borderRadius: 'var(--mantine-radius-sm)',
            }}
            h={'100%'}
          >
            <Image
              src={post.image}
              alt={post.title}
              h={'100%'}
              component={NextImage}
              width={1920}
              height={1080}
              priority
            />
          </Group>
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
              {post.content}
            </Text>
          </Stack>

          <Group gap={'xs'} fz={'xs'}>
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
        </Stack>
      </GridCol>
    </Grid>
  );
}
