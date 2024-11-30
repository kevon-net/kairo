import { iconSize, iconStrokeWidth, iconWrapperSize } from '@/data/constants';
import { typeMenuNavbar } from '@/types/components/menu';
import {
  ActionIcon,
  Card,
  Center,
  Grid,
  GridCol,
  Stack,
  Text,
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
              <ActionIcon
                size={iconWrapperSize + 4}
                variant="default"
                color="pri.6"
              >
                <props.leftSection
                  size={iconSize + 4}
                  stroke={iconStrokeWidth}
                  color="var(--mantine-color-pri-6)"
                />
              </ActionIcon>
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
