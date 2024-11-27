import React from 'react';

import { Paper } from '@mantine/core';

import classes from './glassmorphism.module.scss';

export default function Glassmorphism({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Paper className={classes.root}>
      <div className={classes.underlay}></div>
      {children}
    </Paper>
  );
}
