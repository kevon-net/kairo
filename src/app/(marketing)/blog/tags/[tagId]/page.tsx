import React from 'react';

import { Grid, GridCol } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import CardBlogMain from '@/components/common/cards/blog/main';
import IntroPage from '@/components/layout/intro/page';

import { postsGet } from '@/handlers/requests/database/post';
import { PostRelations } from '@/types/models/post';
import { typeParams } from '../../layout';

export default async function Tag({ params }: { params: typeParams }) {
  const { posts }: { posts: PostRelations[] } = await postsGet();

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Tags`,
          title:
            getTag(
              posts.find((p) => getTag(p, params.tagId)),
              params.tagId
            )?.title || 'Tag',
          desc: `Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
              phasellus mollis sit aliquam sit nullam.`,
        }}
      />

      <LayoutSection id={'page-blog'} margined>
        <Grid gutter={'xl'}>
          {posts
            .filter((p) => getTag(p, params.tagId))
            .map((post) => (
              <GridCol
                key={post.title}
                span={{ base: 12, sm: 6, md: 4, xl: 3 }}
              >
                <CardBlogMain post={post} />
              </GridCol>
            ))}
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}

const getTag = (p?: PostRelations, tagId?: string) =>
  p?.tags.find((t) => t.id == tagId);
