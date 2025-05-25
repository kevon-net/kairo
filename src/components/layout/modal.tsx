import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { Alert } from '@/enums/notification';
import {
  ActionIcon,
  Center,
  Grid,
  GridCol,
  Stack,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  Icon,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import React from 'react';

export default function Modal({
  children,
  props,
  variant,
  size,
}: {
  children: React.ReactNode;
  props: { title: string; close: () => void };
  variant?: Alert;
  size?: string;
}) {
  let options: {
    icon: Icon | null;
    color: string | null;
  } = {
    icon: null,
    color: null,
  };

  switch (variant) {
    case Alert.INFO:
      options = { icon: IconInfoCircle, color: 'blue.6' };
      break;
    case Alert.WARNING:
      options = { icon: IconAlertTriangle, color: 'yellow.6' };
      break;
    case Alert.DANGER:
      options = { icon: IconAlertCircle, color: 'red.6' };
      break;
    default:
      break;
  }

  return (
    <Grid>
      <ActionIcon
        size={ICON_WRAPPER_SIZE}
        onClick={props.close}
        variant="light"
        color="gray"
        pos={'absolute'}
        top={'var(--mantine-spacing-xs)'}
        right={'var(--mantine-spacing-xs)'}
      >
        <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>

      {variant && (
        <GridCol span={{ base: 12, xs: size == 'xl' ? 2 : 2.5 }}>
          {options.icon && (
            <Center mt={{ xs: 'sm' }}>
              <ThemeIcon
                size={ICON_WRAPPER_SIZE * 2}
                variant="light"
                color={options.color || undefined}
              >
                <options.icon size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Center>
          )}
        </GridCol>
      )}

      <GridCol
        span={{
          base: 12,
          xs: variant ? (size == 'xl' ? 10 : 9.5) : undefined,
        }}
      >
        <Stack gap={'md'}>
          <Title
            order={1}
            fz={'xl'}
            lh={1}
            ta={{ base: 'center', xs: 'start' }}
          >
            {props.title}
          </Title>

          {children}
        </Stack>
      </GridCol>
    </Grid>
  );
}
