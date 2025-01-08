import React from 'react';

import Link from 'next/link';

import {
  Anchor,
  Badge,
  Card,
  CardSection,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import classes from './main.module.scss';

import { PostRelations } from '@/types/models/post';

import { linkify } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import ImageDefault from '@/components/common/images/default';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Main({ post }: { post: PostRelations }) {
  const path = `/blog/${linkify(post.title)}-${post.id}`;

  return (
    <Card className={classes.card} bg={'transparent'}>
      <Stack gap={'lg'}>
        <CardSection
          style={{
            borderRadius: 'var(--mantine-radius-sm)',
            overflow: 'hidden',
          }}
        >
          <Anchor
            component={Link}
            underline="hover"
            inherit
            href={path}
            title={post.title}
            pos={'relative'}
          >
            <ImageDefault
              src={post.image}
              alt={post.title}
              height={200}
              mode="grid"
            />

            <Group gap={'xs'} align="start" className={classes.overlay}>
              {post.tags.map((t) => (
                <Badge key={t.id} color="white" c={'black'} radius={'sm'}>
                  {t.title}
                </Badge>
              ))}
            </Group>
          </Anchor>
        </CardSection>

        <CardSection>
          <Stack gap={'lg'} justify="space-between" h={'100%'}>
            <Stack>
              <Title
                order={3}
                fz={{ base: 'xl' }}
                className={classes.title}
                lineClamp={1}
              >
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
              <Text className={classes.desc} lineClamp={3}>
                {post.excerpt}
              </Text>
            </Stack>

            <Group justify="space-between" fz={'sm'}>
              <Group gap={'xs'}>
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
              </Group>

              {post._count.comments && (
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
              )}
            </Group>
          </Stack>
        </CardSection>
      </Stack>
    </Card>
  );
}
