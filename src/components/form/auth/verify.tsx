'use client';

import React from 'react';

import {
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  PinInput,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
import { useFormAuthVerify } from '@/hooks/form/auth/verify';

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

        <Transition mounted={time != undefined} transition="fade" duration={0}>
          {(styles) => (
            <Box
              style={{
                ...styles,
                transition: '0.25s all ease',
              }}
              opacity={requested ? '0' : '1'}
            >
              <Stack
                ta={'center'}
                fz={{
                  base: 'xs',
                  xs: 'sm',
                }}
              >
                <Text c={'dimmed'} inherit>
                  If the email you provided is valid, you should have received
                  the code. Remember to check your spam/junk folder(s). You can
                  otherwise request another code in{' '}
                  <Text component="span" inherit fw={'bold'}>
                    {time?.minutes} minutes
                  </Text>
                  .
                </Text>
              </Stack>
            </Box>
          )}
        </Transition>
      </Stack>
    </form>
  );
}
