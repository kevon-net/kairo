import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import { Group, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react';

export default function Requirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <>
      <Group gap={'xs'} c={meets ? 'teal' : 'red'}>
        {meets ? (
          <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        ) : (
          <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        )}

        <Text inherit fz="sm">
          {label}
        </Text>
      </Group>
    </>
  );
}
