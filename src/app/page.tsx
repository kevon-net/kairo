import React from 'react';

import LayoutBody from '@/components/layout/body';
import NavbarMain from '@/components/layout/navbars/main';
import FooterMain from '@/components/layout/footers/main';
import HeaderMain from '@/components/layout/headers/main';
import LayoutSection from '@/components/layout/section';

import AffixTop from '@/components/common/affixi/top';

export default function Home() {
  return (
    <LayoutBody
      header={<HeaderMain />}
      nav={<NavbarMain />}
      footer={<FooterMain />}
    >
      <main>
        <LayoutSection id={'page-home'} padded>
          Home page
        </LayoutSection>
      </main>

      <AffixTop />
    </LayoutBody>
  );
}
