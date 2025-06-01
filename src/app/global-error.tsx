'use client';

import React from 'react';
import Error500 from '@/components/partial/errors/500';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body>
        <Error500 reset={reset} />
      </body>
    </html>
  );
}
