import React from 'react';
import LayoutPage from '@/components/layout/page';
import LayoutSection from '@/components/layout/section';
import IntroPage from '@/components/layout/intros/page';

export default async function Blog() {
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
        blog
      </LayoutSection>
    </LayoutPage>
  );
}
