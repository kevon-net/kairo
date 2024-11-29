import { Testimonial as typeTestimonial } from '@/types/static';
import { Card, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
import React from 'react';
import NextImage from 'next/image';

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
          <Group>
            <Image
              src={props.cite.company.image}
              alt={props.cite.company.name}
              h={32}
              component={NextImage}
              width={1920}
              height={1080}
              priority
            />
          </Group>

          <Text>&quot;{props.content}&quot;</Text>
        </Stack>

        <Group>
          <Group style={{ borderRadius: 99, overflow: 'hidden' }}>
            <Image
              src={props.cite.person.image}
              alt={props.cite.person.name}
              h={48}
              component={NextImage}
              width={1920}
              height={1080}
              priority
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
