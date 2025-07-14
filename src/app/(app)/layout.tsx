import React from 'react';

import LayoutBody from '@/components/layout/body';
import ProviderStore from '@/components/providers/store';
import ProviderSync from '@/components/providers/sync';
import AppshellMain from '@/components/common/appshells/main';
import ProviderView from '@/components/providers/view';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <main>
        <ProviderStore>
          <ProviderSync>
            <AppshellMain>
              <ProviderView>{children}</ProviderView>
            </AppshellMain>
          </ProviderSync>
        </ProviderStore>
      </main>
    </LayoutBody>
  );
}
