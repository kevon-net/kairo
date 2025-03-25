import React from 'react';

import LayoutBody from '@/components/layout/body';
import NavbarMain from '@/components/layout/navbars/main';
import FooterMain from '@/components/layout/footers/main';

import AffixTop from '@/components/common/affixi/top';
import AffixNavbar from '@/components/common/affixi/navbar';

export default function LayoutMarketing({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody nav={<NavbarMain />} footer={<FooterMain />}>
      <main>{children}</main>

      <AffixTop />
      <AffixNavbar />
    </LayoutBody>
  );
}
