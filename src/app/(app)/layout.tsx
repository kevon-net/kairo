import React from 'react';

import LayoutBody from '@/components/layout/body';
import ProviderStore from '@/components/providers/store';
import ProviderSync from '@/components/providers/sync';
import AppshellMain from '@/components/common/appshells/main';
import { createClient } from '@/libraries/supabase/server';
import ItemEditProvider from '@/components/providers/item-edit';
import PomoCyclesProvider from '@/components/providers/pomo-cycles';
import SessionTimerProvider from '@/components/providers/session-timer';

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
              <SessionTimerProvider>
                <PomoCyclesProvider>
                  <AppshellMain>{children}</AppshellMain>
                </PomoCyclesProvider>
              </SessionTimerProvider>
            </ItemEditProvider>
          </ProviderSync>
        </ProviderStore>
      </main>
    </LayoutBody>
  );
}
