'use client';

import { Box, Group, Title } from '@mantine/core';
import React from 'react';
import classes from './main.module.scss';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { TaskGet } from '@/types/models/task';

export default function Main({ item }: { item: TaskGet }) {
  return (
    <Box className={classes.card}>
      <Group align="start" gap={'xs'} wrap="nowrap" w={'100%'}>
        <Group gap={5} wrap="nowrap" mt={'sm'}>
          <InputCheckboxTask item={item} />
        </Group>

        <div>
          <Title order={2} fz={'sm'} fw={'normal'}>
            {item.title}
          </Title>
        </div>
      </Group>
    </Box>
  );
}
