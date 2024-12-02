import React from 'react';

import Link from 'next/link';
import NextImage from 'next/image';

import {
  Anchor,
  Badge,
  Card,
  CardSection,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import classes from './main.module.scss';

import { PostRelations } from '@/types/models/post';

import { linkify } from '@/utilities/formatters/string';
import { getRegionalDate } from '@/utilities/formatters/date';
import { IconCircleFilled } from '@tabler/icons-react';

export default function Main({ post }: { post: PostRelations }) {
  const path = `/blog/${linkify(post.title)}`;

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
            <Stack>
              <Image
                src={post.image}
                alt={post.title}
                component={NextImage}
                width={1920}
                height={1080}
                priority
              />
            </Stack>

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
                {post.content}
              </Text>
            </Stack>

            <Group gap={'xs'} fz={'sm'}>
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
        </CardSection>
      </Stack>
    </Card>
  );
}
