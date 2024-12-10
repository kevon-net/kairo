import React from 'react';

import Link from 'next/link';

import {
  Anchor,
  Badge,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import classes from './new.module.scss';

import { linkify, getRegionalDate } from '@repo/utils/formatters';
import { PostRelations } from '@repo/types/models';
import { IconCircleFilled, IconMessageCircle } from '@tabler/icons-react';
import ImageDefault from '@/components/common/images/default';
import { iconSize, iconStrokeWidth } from '@/data/constants';

export default function New({ post }: { post: PostRelations }) {
  const path = `/blog/${post.id}-${linkify(post.title)}`;

  return (
    <Card className={classes.card} withBorder bg={'transparent'}>
      <Grid gutter={0}>
        <GridCol span={{ base: 12, sm: 6 }}>
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
              height={400}
              mode="grid"
            />

            <Group gap={'xs'} align="start" className={classes.overlay}>
              {post.tags.map((t) => (
                <Badge key={t.id} radius={'sm'} color="white" c={'black'}>
                  {t.title}
                </Badge>
              ))}
            </Group>
          </Anchor>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
          <Stack
            gap={'lg'}
            px={{ base: 'lg', sm: 'xl' }}
            py={{ base: 'lg', md: 32 }}
            justify="space-between"
            h={'100%'}
          >
            <Stack>
              <Badge
                size="sm"
                color="blue"
                radius={'sm'}
                leftSection={<IconCircleFilled size={4} />}
              >
                latest
              </Badge>

              <Title order={3} fz={28} lh={{ md: 1 }} className={classes.title}>
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

              <Text className={classes.desc} lineClamp={6}>
                {post.excerpt}
              </Text>
            </Stack>

            <Stack>
              <Divider />

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
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
