import { Team as typeTeam } from '@/types/static';
import { ActionIcon, Card, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import ImageDefault from '@/components/common/images/default';

export default function Team({ props }: { props: typeTeam }) {
  return (
    <Card padding={0} bg={'transparent'}>
      <Stack gap={'lg'}>
        <ImageDefault
          src={props.image}
          alt={props.name}
          height={{ base: 320, xs: 240, sm: 280, md: 200, lg: 280 }}
          radius={'sm'}
          mode="grid"
        />

        <Stack gap={'xs'}>
          <Title order={3}>{props.name}</Title>
          <Text c={'dimmed'}>{props.title}</Text>
        </Stack>

        <Group gap={'xs'}>
          {props.socials.map((social) => (
            <ActionIcon
              key={social.link}
              size={ICON_WRAPPER_SIZE}
              color="pri.6"
              variant="light"
            >
              <social.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
