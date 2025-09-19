import React from 'react';

import LayoutBody from '@/components/layout/body';
import ProviderStore from '@/components/providers/store';
import ProviderSync from '@/components/providers/sync';
import AppshellMain from '@/components/common/appshells/main';
import { createClient } from '@/libraries/supabase/server';
import ItemEditProvider from '@/components/providers/item-edit';

export default async function LayoutApp({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();

  return (
    <LayoutBody>
      <main>
        <ProviderStore session={session.user}>
          <ProviderSync>
            <ItemEditProvider>
              <AppshellMain>{children}</AppshellMain>
            </ItemEditProvider>
          </ProviderSync>
        </ProviderStore>
      </main>
    </LayoutBody>
  );
}
