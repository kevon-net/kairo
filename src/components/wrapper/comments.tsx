'use client';

import React, { useState } from 'react';

import Transition from './transition';
import LayoutSection from '../layout/section';
import { Button } from '@mantine/core';

export default function Comments({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: { comments?: number };
}) {
  const [mounted, setMounted] = useState(false);

  return (
    <div>
      {!mounted && (
        <LayoutSection id={'page-post-comment'} padded containerized={'sm'}>
          <Button
            variant="default"
            fullWidth
            onClick={() => setMounted(!mounted)}
          >
            Show Comments ({props?.comments || 0})
          </Button>
        </LayoutSection>
      )}

      <Transition mounted={mounted}>{children}</Transition>
    </div>
  );
}
