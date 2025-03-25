import React from 'react';

import { alpha } from '@mantine/core';

import classes from './glassmorphism.module.scss';

export default function Glassmorphism({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={classes.bg}
      style={{ backgroundColor: alpha('var(--mantine-color-body)', 0.9) }}
    >
      {children}
    </div>
  );
}
