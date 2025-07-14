import LayoutPage from '@/components/layout/page';
import { Anchor, Stack } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  return (
    <LayoutPage>
      <main>
        <Stack py={'xl'} align="center" justify={'center'} h={'100vh'}>
          <p>
            Get started by editing <code>src/app/page.tsx</code>.
          </p>

          <p>Save and see your changes instantly.</p>

          <Anchor component={Link} href={'/app/inbox'} inherit ta="center">
            App
          </Anchor>
        </Stack>
      </main>
    </LayoutPage>
  );
}
