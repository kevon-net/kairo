'use client';

import { ICON_SIZE } from '@/data/constants';
import {
  Spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
  spotlight,
} from '@mantine/spotlight';
import { IconSearch, IconCircleFilled } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from './search.module.scss';
import { useAppSelector } from '@/hooks/redux';
import { linkify } from '@/utilities/formatters/string';

export default function Search({ children }: { children: React.ReactNode }) {
  const categories = useAppSelector((state) => state.categories.value);
  const router = useRouter();

  const actions: (SpotlightActionGroupData | SpotlightActionData)[] = (
    categories || []
  ).map((c) => {
    return {
      id: c.id,
      label: c.title,
      leftSection: (
        <IconCircleFilled size={ICON_SIZE / 2.5} color={c.color || undefined} />
      ),
      onClick: () => router.push(`/app/projects/${linkify(c.title)}-${c.id}`),
    };
  });

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
          placeholder: 'Search category...',
        }}
        classNames={classes}
      />
    </>
  );
}
