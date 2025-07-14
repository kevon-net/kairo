'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';
import {
  Spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
  spotlight,
} from '@mantine/spotlight';
import {
  IconSearch,
  IconSun,
  IconCalendarEvent,
  IconCalendarMonth,
  IconClearAll,
  IconCircleCheck,
  IconInbox,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './search.module.scss';

export default function Search({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const actions: (SpotlightActionGroupData | SpotlightActionData)[] = [
    {
      group: 'Navigation',
      actions: [
        {
          id: 'today',
          label: 'Today',
          leftSection: <IconSun size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />,
          onClick: () => router.push(`/app/today`),
        },
        {
          id: 'upcoming',
          label: 'Upcoming',
          leftSection: (
            <IconCalendarEvent size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/upcoming`),
        },
        {
          id: 'planned',
          label: 'Planned',
          leftSection: (
            <IconCalendarMonth size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/planned`),
        },
        {
          id: 'all',
          label: 'All',
          leftSection: (
            <IconClearAll size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/all`),
        },
        {
          id: 'completed',
          label: 'Completed',
          leftSection: (
            <IconCircleCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/completed`),
        },
        {
          id: 'inbox',
          label: 'Inbox',
          leftSection: (
            <IconInbox size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          ),
          onClick: () => router.push(`/app/inbox`),
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
