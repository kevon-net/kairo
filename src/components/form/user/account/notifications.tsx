'use client';

import React from 'react';

import {
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';

import { useFormUserAccountNotifications } from '@/hooks/form/account/notifications';

import classes from './notifications.module.scss';

export default function Notifications() {
  const { form, sending, handleSubmit } = useFormUserAccountNotifications();

  const getLabel = ({ title, desc }: { title: string; desc?: string }) => (
    <Stack gap={0}>
      <Title order={4} fz={'md'}>
        {title}
      </Title>
      {desc && <Text fz={'sm'}>{desc}</Text>}
    </Stack>
  );

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap={'xl'}>
        <Grid>
          <GridCol span={{ base: 12 }}>
            <Title order={4} fz={'lg'}>
              Email Notifications
            </Title>
          </GridCol>

          <GridCol span={{ base: 12 }}>
            <Divider />
          </GridCol>

          <GridCol span={{ base: 12 }}>
            <Switch
              classNames={{
                body: classes.body,
                labelWrapper: classes.labelWrapper,
              }}
              labelPosition="left"
              label={getLabel({
                title: 'Weekly Notification',
                desc: 'Various versions have evolved over the years, sometimes by accident, sometimes on purpose.',
              })}
            />
          </GridCol>
          <GridCol span={{ base: 12 }}>
            <Switch
              classNames={{
                body: classes.body,
                labelWrapper: classes.labelWrapper,
              }}
              labelPosition="left"
              label={getLabel({
                title: 'Account Summary',
                desc: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis eguris eu sollicitudin massa.',
              })}
            />
          </GridCol>
        </Grid>

        <Grid>
          <GridCol span={{ base: 12 }}>
            <Title order={4} fz={'lg'}>
              Order Updates
            </Title>
          </GridCol>

          <GridCol span={{ base: 12 }}>
            <Divider />
          </GridCol>

          <GridCol span={{ base: 12 }}>
            <Switch
              classNames={{
                body: classes.body,
                labelWrapper: classes.labelWrapper,
              }}
              labelPosition="left"
              label={getLabel({
                title: 'Text messages',
              })}
            />
          </GridCol>
          <GridCol span={{ base: 12 }}>
            <Switch
              classNames={{
                body: classes.body,
                labelWrapper: classes.labelWrapper,
              }}
              labelPosition="left"
              label={getLabel({
                title: 'Call before checkout',
                desc: "We'll only call if there are pending changes.",
              })}
            />
          </GridCol>
        </Grid>

        <Group>
          <Button type="submit" color="pri" loading={sending} mt={'md'}>
            {sending ? 'Saving' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
