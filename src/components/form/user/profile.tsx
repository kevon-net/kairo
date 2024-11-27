'use client';

import React from 'react';

import { Box, Button, Grid, GridCol, TextInput } from '@mantine/core';
import { useFormUserProfile } from '@/hooks/form/account/profile';

export default function Profile() {
  const { form, submitted, handleSubmit, session } = useFormUserProfile();

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12, sm: 6 }}>
          <TextInput
            required
            label={'First Name'}
            placeholder="First Name"
            {...form.getInputProps('name.first')}
            disabled={!session}
          />
        </GridCol>
        <GridCol span={{ base: 12, sm: 6 }}>
          <TextInput
            required
            label={'Last Name'}
            placeholder="Last Name"
            {...form.getInputProps('name.last')}
            disabled={!session}
          />
        </GridCol>
        <GridCol span={{ base: 12 }}>
          <TextInput
            label={'Phone'}
            placeholder="Your Phone"
            {...form.getInputProps('phone')}
          />
        </GridCol>
        <GridCol span={{ base: 6 }}>
          <Button type="submit" loading={submitted} mt={'md'}>
            {submitted ? 'Submitting' : 'Submit'}
          </Button>
        </GridCol>
      </Grid>
    </Box>
  );
}
