import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { Card, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import React from 'react';

export default function Purpose({
  props,
}: {
  props: { icon: Icon; title: string; desc: string };
}) {
  return (
    <Card px={'xl'} py={0} bg={'transparent'} h={'100%'}>
      <Stack>
        <ThemeIcon
          variant="transparent"
          size={ICON_WRAPPER_SIZE + 16}
          c={'pri.6'}
        >
          <props.icon size={ICON_SIZE + 16} stroke={ICON_STROKE_WIDTH - 0.5} />
        </ThemeIcon>

        <Title order={3}>{props.title}</Title>

        <Text>{props.desc}</Text>
      </Stack>
    </Card>
  );
}
