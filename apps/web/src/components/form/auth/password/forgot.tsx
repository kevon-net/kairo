'use client';

import React from 'react';

import {
  Alert,
  Button,
  Grid,
  GridCol,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useFormAuthPasswordForgot } from '@/hooks/form/auth/password';

import WrapperTransition from '@/components/wrapper/transition';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Forgot() {
  const { form, handleSubmit, sending, requested, time } =
    useFormAuthPasswordForgot();

  return (
    <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={'xl'}>
        <Grid>
          <GridCol span={{ base: 12, sm: 12 }}>
            <TextInput
              required
              aria-label={'Email'}
              placeholder="Email"
              {...form.getInputProps('email')}
            />
          </GridCol>
          <GridCol span={{ base: 12 }}>
            <Button fullWidth type="submit" color="pri" loading={sending}>
              {sending ? 'Sending Reset Link' : 'Send Reset Link'}
            </Button>
          </GridCol>
        </Grid>

        <WrapperTransition mounted={time != undefined || requested}>
          <Alert
            color="yellow"
            icon={
              <IconAlertTriangle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            fz={'sm'}
          >
            To prevent our system from abuse, we limit the number of times a
            user can reset their password. Remember to check your spam/junk
            folder(s). You can otherwise request a new link in{' '}
            <Text component="span" inherit fw={'bold'}>
              {time?.minutes} minutes
            </Text>
            .
          </Alert>
        </WrapperTransition>
      </Stack>
    </form>
  );
}
