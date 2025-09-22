'use client';

import {
  Spotlight,
  SpotlightActionData,
  SpotlightActionGroupData,
  createSpotlight,
} from '@mantine/spotlight';
import classes from './commands.module.scss';
import { Badge } from '@mantine/core';

export const [store, spotlight] = createSpotlight();

export default function Commands({ children }: { children: React.ReactNode }) {
  const commands = [
    {
      title: 'Open command palette',
      operation: () => {},
      shortcut: 'Ctrl + P',
      hotkey: 'mod + K',
    },
    {
      title: 'Create new note',
      operation: () => {},
      shortcut: 'Ctrl + N',
      hotkey: 'mod + N',
    },
    {
      title: 'Create new folder',
      operation: () => {},
      shortcut: 'Ctrl + F',
      hotkey: 'mod + F',
    },
    {
      title: 'Navigate back',
      operation: () => {},
      shortcut: 'Ctrl + <',
      hotkey: 'mod + ,',
    },
    {
      title: 'Navigate forward',
      operation: () => {},
      shortcut: 'Ctrl + >',
      hotkey: 'mod + .',
    },
  ];

  const actions: (SpotlightActionGroupData | SpotlightActionData)[] =
    commands.map((c, i) => {
      return {
        id: `${i}-${c.title}-${c.shortcut}`,
        label: c.title,
        rightSection: c.hotkey && c.shortcut && (
          <Badge
            fz={'sm'}
            tt={'none'}
            radius={'sm'}
            fw={'normal'}
            color="dark.6"
            p={5}
          >
            {c.shortcut}
          </Badge>
        ),
        onClick: c.operation,
      };
    });

  return (
    <>
      <div onClick={spotlight.open}>{children}</div>

      <Spotlight
        store={store}
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        scrollable
        maxHeight={350}
        centered
        searchProps={{
          // leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: 'Search command...',
        }}
        classNames={classes}
      />
    </>
  );
}
