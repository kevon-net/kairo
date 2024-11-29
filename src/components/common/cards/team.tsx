import { Team as typeTeam } from '@/types/static';
import {
  ActionIcon,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import NextImage from 'next/image';
import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';

export default function Team({ props }: { props: typeTeam }) {
  return (
    <Card padding={0} bg={'transparent'}>
      <Stack gap={'lg'}>
        <Stack
          h={270}
          style={{
            overflow: 'hidden',
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        >
          <Image
            src={props.image}
            alt={props.name}
            component={NextImage}
            width={1920}
            height={1080}
            priority
          />
        </Stack>

        <Stack gap={'xs'}>
          <Title order={3}>{props.name}</Title>
          <Text c={'dimmed'}>{props.title}</Text>
        </Stack>

        <Group gap={'xs'}>
          {props.socials.map((social) => (
            <ActionIcon
              key={social.link}
              size={iconWrapperSize}
              // color="gray"
              variant="light"
            >
              <social.icon size={iconSize} stroke={iconStrokeWidth} />
            </ActionIcon>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
