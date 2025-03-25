import React from 'react';
import LayoutBody from '@/components/layout/body';
import AffixTop from '@/components/common/affixi/top';

export default function LayoutMarketing({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <main>{children}</main>

      <AffixTop />
    </LayoutBody>
  );
}
