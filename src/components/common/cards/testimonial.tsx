import { Testimonial as typeTestimonial } from '@/types/static';
import { Card, Flex, Group, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import ImageDefault from '@/components/common/images/default';

export default function Testimonial({ props }: { props: typeTestimonial }) {
  return (
    <Card withBorder shadow="xs" bg={'transparent'} h={'100%'} mx={'md'}>
      <Flex
        direction={'column'}
        gap={'lg'}
        justify={'space-between'}
        h={'100%'}
      >
        <Stack gap={'lg'}>
          <ImageDefault
            src={props.cite.company.image}
            alt={props.cite.company.name}
            height={32}
            width={80}
            mode="grid"
          />

          <Text>&quot;{props.content}&quot;</Text>
        </Stack>

        <Group>
          <Group style={{ borderRadius: 99, overflow: 'hidden' }}>
            <ImageDefault
              src={props.cite.person.image}
              alt={props.cite.person.name}
              height={48}
              width={48}
              mode="grid"
            />
          </Group>

          <Stack gap={0}>
            <Title order={3} fz={'sm'}>
              {props.cite.person.name}
            </Title>
            <Text fz={'sm'} c={'dimmed'}>
              {props.cite.person.title}
            </Text>
          </Stack>
        </Group>
      </Flex>
    </Card>
  );
}
