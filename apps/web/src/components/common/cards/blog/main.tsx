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

import { PostRelations } from '@repo/types/models';

import { linkify, getRegionalDate } from '@repo/utils/formatters';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import ImageDefault from '@/components/common/images/default';
import { iconSize, iconStrokeWidth } from '@/data/constants';

export default function Main({ post }: { post: PostRelations }) {
  const path = `/blog/${post.id}-${linkify(post.title)}`;

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
                    size={iconSize - 4}
                    stroke={iconStrokeWidth}
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
