'use client';

import React from 'react';

import classes from './app.module.scss';
import { Box } from '@mantine/core';

export default function App({ props }: { props?: { size?: number } }) {
  return (
    <Box
      w={props?.size || 24}
      h={props?.size || 24}
      className={classes.spinner}
    ></Box>
  );
}
