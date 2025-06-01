import React from 'react';
import { Box, Stack } from '@mantine/core';
import { Page as typePage } from '@/types/layout';
import { SECTION_SPACING } from '@/data/constants';

export default function Page({
  children,
  padded,
  stacked,
  ...restProps
}: typePage & React.ComponentProps<typeof Box & typeof Stack>) {
  return (
    <Box
      component={stacked ? Stack : 'article'}
      w={'100%'}
      gap={
        stacked
          ? typeof stacked == 'boolean'
            ? SECTION_SPACING
            : stacked
          : undefined
      }
      py={
        padded
          ? typeof padded == 'boolean'
            ? SECTION_SPACING
            : padded
          : undefined
      }
      {...restProps}
    >
      {children}
    </Box>
  );
}
