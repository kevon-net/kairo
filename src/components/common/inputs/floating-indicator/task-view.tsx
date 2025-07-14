'use client';

import { useState } from 'react';
import { FloatingIndicator, Stack, Text, UnstyledButton } from '@mantine/core';
import classes from './task-view.module.scss';
import {
  IconCalendarWeek,
  IconLayoutKanban,
  IconList,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function TaskView() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const [active, setActive] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const controls = layouts.map((layout, index) => (
    <UnstyledButton
      key={index}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => setActive(index)}
      mod={{ active: active === index }}
    >
      <Stack gap={'xs'} className={classes.controlLabel} align="center">
        <layout.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        <Text component={'span'} fz={'xs'}>
          {layout.label}
        </Text>
      </Stack>
    </UnstyledButton>
  ));

  return (
    <div className={classes.root} ref={setRootRef}>
      {controls}

      <FloatingIndicator
        target={controlsRefs[active]}
        parent={rootRef}
        className={classes.indicator}
      />
    </div>
  );
}

const layouts = [
  {
    icon: IconList,
    label: 'List',
  },
  {
    icon: IconLayoutKanban,
    label: 'Board',
  },
  {
    icon: IconCalendarWeek,
    label: 'Calendar  ',
  },
];
