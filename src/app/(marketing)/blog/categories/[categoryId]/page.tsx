import React from 'react';

import { Grid, GridCol, Stack, Text, Title } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import CardBlogMain from '@/components/common/cards/blog/main';

import { postsGet } from '@/handlers/requests/database/post';
import { PostRelations } from '@/types/models/post';
import { typeParams } from '../../layout';

export default async function Category({ params }: { params: typeParams }) {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  return (
    <LayoutPage>
      <LayoutSection id={'page-blog'} margined>
        <Stack gap={'xl'}>
          <Stack align="center">
            <Title order={1} ta={'center'}>
              {
                posts.find((p) => p.category?.id == params.categoryId)?.category
                  ?.title
              }
            </Title>
            <Text ta={'center'} w={{ md: '50%', lg: '40%' }}>
              Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
              phasellus mollis sit aliquam sit nullam.
            </Text>
          </Stack>

          <Grid gutter={'xl'}>
            {posts
              .filter((p) => p.category?.id == params.categoryId)
              .map((post) => (
                <GridCol key={post.title} span={{ base: 12, sm: 6, md: 4 }}>
                  <CardBlogMain post={post} />
                </GridCol>
              ))}
          </Grid>
        </Stack>
      </LayoutSection>
    </LayoutPage>
  );
}
