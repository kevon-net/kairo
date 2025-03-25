import React from 'react';
import LayoutBody from '@/components/layout/body';
import LayoutSection from '@/components/layout/section';
import AffixTop from '@/components/common/affixi/top';

export default function Home() {
  return (
    <LayoutBody>
      <main>
        <LayoutSection id={'page-home'} margined>
          home page
        </LayoutSection>
      </main>

      <AffixTop />
    </LayoutBody>
  );
}
