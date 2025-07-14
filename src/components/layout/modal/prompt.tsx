import {
  APPSHELL,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import {
  ActionIcon,
  Card,
  CardSection,
  Divider,
  Group,
  ScrollAreaAutosize,
  Title,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import React from 'react';

export default function Prompt({
  props,
  children,
}: {
  props: {
    title: React.ReactNode;
    footer?: React.ReactNode;
    close: () => void;
  };
  children: React.ReactNode;
}) {
  return (
    <Card padding={0} bg={'transparent'}>
      <CardSection p={'xs'}>
        <Group justify="space-between">
          <Group gap={'xs'}>
            {typeof props.title == 'string' ? (
              <Title order={1} fz={'sm'} fw={500}>
                {props.title}
              </Title>
            ) : (
              props.title
            )}
          </Group>

          <ActionIcon
            size={ICON_WRAPPER_SIZE}
            color="gray"
            variant="subtle"
            onClick={props.close}
          >
            <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Group>
      </CardSection>

      <CardSection>
        <Divider mt={'xs'} />
      </CardSection>

      <ScrollAreaAutosize
        type="auto"
        mah={320}
        scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
        scrollbars="y"
      >
        <CardSection p={'sm'}>{children}</CardSection>
      </ScrollAreaAutosize>

      {props.footer && (
        <>
          <CardSection>
            <Divider mb={'xs'} />
          </CardSection>

          <CardSection p={'xs'}>{props.footer}</CardSection>
        </>
      )}
    </Card>
  );
}
