import React from 'react';
import { Box, Divider } from '@mantine/core';
import { APPSHELL } from '@/data/constants';
import ControlTheme from '@/components/common/segmented-control/theme';

export default function Footer() {
  return (
    <>
      <Divider />

      <Box p={APPSHELL.PADDING}>
        <ControlTheme />
      </Box>
    </>
  );
}
