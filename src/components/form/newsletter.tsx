'use client';

import React from 'react';

import { Box, Button, Grid, GridCol, TextInput } from '@mantine/core';
import TooltipInputInfo from '../common/tooltips/input/info';
import { useFormNewsletter } from '@/hooks/form/newsletter';

import classes from './newsletter.module.scss';

export default function Newsletter() {
  const { form, submitted, handleSubmit } = useFormNewsletter();

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid gutter={{ base: 'xs', xs: 0 }}>
        <GridCol span={{ base: 12, xs: 8 }}>
          <TextInput
            required
            aria-label={'Email'}
            placeholder={`Your Email *`}
            {...form.getInputProps('email')}
            rightSection={<TooltipInputInfo />}
            classNames={{ input: classes.input }}
          />
        </GridCol>

        <GridCol span={{ base: 12, xs: 4 }}>
          <Button
            fullWidth
            type="submit"
            loading={submitted}
            classNames={{ root: classes.button }}
          >
            {submitted ? 'Subscribing' : 'Subscribe'}
          </Button>
        </GridCol>
      </Grid>
    </Box>
  );
}
