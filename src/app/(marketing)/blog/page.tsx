import React from 'react';

import { Grid, GridCol } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import CardBlogNew from '@/components/common/cards/blog/new';
import CardBlogMain from '@/components/common/cards/blog/main';
import IntroPage from '@/components/layout/intro/page';

import { postsGet } from '@/handlers/requests/database/post';
import { PostRelations } from '@/types/models/post';

export default async function Blog() {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: 'News',
          title: 'Expert Web Design Advice',
          desc: 'Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam. Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.',
        }}
      />

      <LayoutSection id={'page-blog-grid'} margined>
        <Grid gutter={'xl'}>
          <GridCol span={12} mx={{ lg: 'auto' }} visibleFrom="md">
            <CardBlogNew post={posts[0]} />
          </GridCol>

          <GridCol span={{ base: 12, xs: 6 }} hiddenFrom="md">
            <CardBlogMain post={posts[0]} />
          </GridCol>

          {posts.map(
            (post) =>
              posts.indexOf(post) != 0 && (
                <GridCol
                  key={post.title}
                  span={{ base: 12, xs: 6, md: 4, xl: 3 }}
                >
                  <CardBlogMain post={post} />
                </GridCol>
              )
          )}
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
