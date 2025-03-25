import React from 'react';

import LayoutBody from '@/components/layout/body';
import NavbarMain from '@/components/layout/navbars/main';
import FooterMain from '@/components/layout/footers/main';
import AsideAccount from '@/components/layout/asides/account';
import LayoutSection from '@/components/layout/section';

import AffixTop from '@/components/common/affixi/top';
import AffixNavbar from '@/components/common/affixi/navbar';

import appData from '@/data/app';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Account',
    template: `%s - Account - ${appData.name.app}`,
  },
};

export default function LayoutAccount({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody
      nav={<NavbarMain />}
      aside={{
        gap: 48,
        left: {
          component: <AsideAccount />,
          width: { md: 30, lg: 22.5 },
          withBorder: true,
        },
      }}
      footer={<FooterMain />}
    >
      <LayoutSection
        containerized={false}
        id={'layout-account'}
        component={'main'}
      >
        {children}
      </LayoutSection>

      <AffixTop />
      <AffixNavbar />
    </LayoutBody>
  );
}
