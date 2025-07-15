'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import {
  Spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
  spotlight,
} from '@mantine/spotlight';
import { IconSearch, IconHome, IconTimeline } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './search.module.scss';

export default function Search({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions: (SpotlightActionGroupData | SpotlightActionData)[] = [
    {
      group: 'Navigation',
      actions: [
        {
          id: 'home',
          label: 'Home',
          leftSection: <IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
          onClick: () => router.push(`/app/home`),
        },
        {
          id: 'timeline',
          label: 'Timeline',
          leftSection: (
            <IconTimeline size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/timeline`),
        },
      ],
    },
  ];

  return (
    <>
      <div onClick={spotlight.open}>{children}</div>

      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        scrollable
        maxHeight={480}
        centered
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: 'Search or type a command...',
        }}
        classNames={classes}
      />
    </>
  );
}
