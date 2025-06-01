import LayoutPage from '@/components/layout/page';
import { Stack } from '@mantine/core';

export default function Home() {
  return (
    <LayoutPage>
      <main>
        <Stack py={'xl'} align="center" justify={'center'} h={'100vh'}>
          <p>
            Get started by editing <code>src/app/page.tsx</code>.
          </p>

          <p>Save and see your changes instantly.</p>
        </Stack>
      </main>
    </LayoutPage>
  );
}
