import React from 'react';
import LayoutPage from '@/components/layout/page';
import IntroPage from '@/components/layout/intros/page';
import appData from '@/data/app';

export default function Home() {
  return (
    <LayoutPage>
      <IntroPage
        props={{
          path: `${appData.name.company}`,
          title: 'Next Static',
          desc: `A lightweight and optimized Next.js template for building fast, SEO-friendly static websites.`,
        }}
      />
    </LayoutPage>
  );
}
