'use client';

import { SessionGet } from '@/types/models/session';
import { capitalizeWord } from '@/utilities/formatters/string';
import {
  Badge,
  Card,
  CardSection,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import ModalDeleteSession from '../modals/delete/session';
import { useAppSelector } from '@/hooks/redux';
import { getRegionalDate } from '@/utilities/formatters/date';

export default function Session({ props }: { props: SessionGet }) {
  const session = useAppSelector((state) => state.session.value);

  return (
    <Card withBorder bg={'transparent'} shadow="xs">
      <Stack>
        <Group justify="space-between" align="end">
          <Group gap={'xs'} align="start">
            <Title order={2} fz={'lg'} my={0} lh={1}>
              {capitalizeWord(props.os!)}
            </Title>

            {session?.id == props.id && (
              <Badge size="sm" variant="light" color="blue.6" radius={'sm'}>
                current
              </Badge>
            )}
          </Group>

          <ModalDeleteSession props={props} />
        </Group>

        <CardSection>
          <Divider />
        </CardSection>

        <Stack gap={4} fz={'sm'} fw={'bold'}>
          <Group
            grow
            preventGrowOverflow={false}
            wrap="nowrap"
            align="end"
            gap={'xs'}
          >
            <Text inherit>IP:</Text>

            <Divider variant="dashed" w={'100%'} pb={5} />

            <Text component="span" inherit fw={'normal'} ta={'end'}>
              {props.ip}
            </Text>
          </Group>

          <Group
            grow
            preventGrowOverflow={false}
            wrap="nowrap"
            align="end"
            gap={'xs'}
          >
            <Text inherit>Location:</Text>

            <Divider variant="dashed" w={'100%'} pb={5} />

            <Text component="span" inherit fw={'normal'} ta={'end'}>
              {`${props.city}(${props.country})`}
            </Text>
          </Group>

          <Group
            grow
            preventGrowOverflow={false}
            wrap="nowrap"
            align="end"
            gap={'xs'}
          >
            <Text inherit>GPS:</Text>

            <Divider variant="dashed" w={'100%'} pb={5} />

            <Text component="span" inherit fw={'normal'} ta={'end'}>
              {props.loc}
            </Text>
          </Group>

          <Group
            grow
            preventGrowOverflow={false}
            wrap="nowrap"
            align="end"
            gap={'xs'}
          >
            <Text inherit>LastActive:</Text>

            <Divider variant="dashed" w={'100%'} pb={5} />

            <Text inherit fw={'normal'} ta={'end'}>
              {getRegionalDate(props.updatedAt).date}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
