import React from 'react';
import { Box, Container } from '@mantine/core';
import { Section as typeSection } from '@/types/layout';
import classes from './section.module.scss';
import { SECTION_SPACING } from '@/data/constants';

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
      py={padded ? (typeof padded == 'boolean' ? SECTION_SPACING : padded) : ''}
      my={
        margined
          ? typeof margined == 'boolean'
            ? SECTION_SPACING
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
