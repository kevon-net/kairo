'use client';

import React from 'react';

import {
  Alert,
  Button,
  Grid,
  GridCol,
  Group,
  PinInput,
  Stack,
  Text,
} from '@mantine/core';
import { useFormAuthVerify } from '@/hooks/form/auth/verify';
import WrapperTransition from '@/components/wrapper/transition';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Verify() {
  const { form, handleSubmit, handleRequest, submitted, requested, time } =
    useFormAuthVerify();

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap={40}>
        <Stack>
          <Group justify="center">
            <PinInput
              {...form.getInputProps('otp')}
              type={'number'}
              length={6}
              oneTimeCode
              styles={{ input: { fontWeight: 'bold' } }}
            />
          </Group>

          <Grid>
            <GridCol span={{ base: 12, xs: 6 }}>
              <Button
                fullWidth
                loading={requested}
                variant="light"
                onClick={handleRequest}
              >
                {requested ? 'Requesting' : 'Request New Code'}
              </Button>
            </GridCol>

            <GridCol span={{ base: 12, xs: 6 }}>
              <Button fullWidth type="submit" loading={submitted}>
                {submitted ? 'Verifying' : 'Verify'}
              </Button>
            </GridCol>
          </Grid>
        </Stack>

        <WrapperTransition mounted={time != undefined}>
          <Alert
            color="yellow"
            icon={
              <IconAlertTriangle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            fz={'sm'}
          >
            If the email you provided is valid, you should have received the
            code. Remember to check your spam/junk folder(s). You can otherwise
            request another code in{' '}
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
