import React from 'react';

import { Grid, GridCol } from '@mantine/core';

import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import CardBlogMain from '@/components/common/cards/blog/main';
import IntroPage from '@/components/layout/intro/page';

import { typeParams } from '../../layout';
import { categoryGet } from '@/handlers/requests/database/category';
import { CategoryRelations } from '@/types/models/category';

export default async function Category({ params }: { params: typeParams }) {
  const { category }: { category: CategoryRelations } = await categoryGet({
    categoryId: params.categoryId,
  });

  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `Categories`,
          title: category.title,
          desc: `Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
              phasellus mollis sit aliquam sit nullam.`,
        }}
      />

      <LayoutSection id={'page-blog'} margined>
        <Grid gutter={'xl'}>
          {category.posts.map((post) => (
            <GridCol key={post.title} span={{ base: 12, sm: 6, md: 4, xl: 3 }}>
              <CardBlogMain post={post} />
            </GridCol>
          ))}
        </Grid>
      </LayoutSection>
    </LayoutPage>
  );
}
