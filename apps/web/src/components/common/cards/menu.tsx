import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@/data/constants';
import { typeMenuNavbar } from '@/types/components/menu';
import {
  Card,
  Center,
  Grid,
  GridCol,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import React from 'react';

export default function Menu({ props }: { props: typeMenuNavbar }) {
  return (
    <Card padding={'xs'} bg={'transparent'}>
      <Grid>
        <GridCol span={2}>
          {props.leftSection && (
            <Center>
              <ThemeIcon
                size={ICON_WRAPPER_SIZE + 4}
                variant="default"
                color="pri.6"
              >
                <props.leftSection
                  size={ICON_SIZE + 4}
                  stroke={ICON_STROKE_WIDTH}
                  color="var(--mantine-color-pri-6)"
                />
              </ThemeIcon>
            </Center>
          )}
        </GridCol>

        <GridCol span={10}>
          <Stack gap={4}>
            <Title order={2} fz={'sm'} lh={1}>
              {props.label}
            </Title>

            <Text fz={'xs'}>{props.desc}</Text>
          </Stack>
        </GridCol>
      </Grid>
    </Card>
  );
}
