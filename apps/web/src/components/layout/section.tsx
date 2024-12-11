import React from 'react';

import { Box, Container } from '@mantine/core';

import { Section as typeSection } from '@repo/types';

import classes from './section.module.scss';
import { sectionSpacing } from '@/data/constants';

export default function Section({
  containerized = 'responsive',
  padded,
  margined,
  className,
  bordered,
  shadowed,
  bg,
  children,
  id,
  ...restProps
}: typeSection & React.ComponentProps<typeof Box & typeof Container>) {
  return (
    <Box
      component={'section'}
      id={id}
      py={padded ? (typeof padded == 'boolean' ? sectionSpacing : padded) : ''}
      my={
        margined
          ? typeof margined == 'boolean'
            ? sectionSpacing
            : margined
          : ''
      }
      className={
        (className ? `${className}` : '') +
        (bordered ? ` ${classes.border}` : '') +
        (shadowed ? ` ${classes.shadow}` : '')
      }
      bg={bg}
      {...restProps}
    >
      {containerized ? (
        <Container
          size={typeof containerized == 'boolean' ? undefined : containerized}
        >
          <React.Fragment>{children}</React.Fragment>
        </Container>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </Box>
  );
}
