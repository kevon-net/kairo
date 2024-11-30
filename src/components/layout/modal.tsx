import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
import { Alert } from '@/types/enums';
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
}: {
  children: React.ReactNode;
  props: { title: string; close: () => void };
  variant?: Alert;
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
        size={iconWrapperSize}
        onClick={props.close}
        variant="light"
        color="gray"
        pos={'absolute'}
        top={'var(--mantine-spacing-xs)'}
        right={'var(--mantine-spacing-xs)'}
      >
        <IconX size={iconSize} stroke={iconStrokeWidth} />
      </ActionIcon>

      {variant && (
        <GridCol span={{ base: 12, xs: 2.5 }}>
          {options.icon && (
            <Center mt={{ xs: 'sm' }}>
              <ThemeIcon
                size={iconWrapperSize * 2}
                variant="light"
                color={options.color || undefined}
              >
                <options.icon size={iconSize * 2} stroke={iconStrokeWidth} />
              </ThemeIcon>
            </Center>
          )}
        </GridCol>
      )}

      <GridCol span={{ base: 12, xs: variant ? 9.5 : undefined }}>
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
