'use client';

import React from 'react';

import {
  Alert,
  Box,
  Button,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useFormUserAccountDeleteRequest } from '@/hooks/form/account/delete/request';
import WrapperTransition from '@/components/wrapper/transition';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@/data/constants';

export default function Delete({ close }: { close?: () => void }) {
  const { form, submitted, handleSubmit, time } =
    useFormUserAccountDeleteRequest(close);

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        <WrapperTransition mounted={time != undefined}>
          <Alert
            color="yellow"
            icon={
              <IconAlertTriangle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            fz={'sm'}
          >
            To prevent our system from abuse, we limit the number of times a
            user can request a link. Remember to check your spam/junk folder(s).
            You can otherwise request another account deletion link in{' '}
            <Text component="span" inherit fw={'bold'}>
              {time?.minutes} minutes
            </Text>
            .
          </Alert>
        </WrapperTransition>

        <PasswordInput
          label={'Password'}
          placeholder="********"
          {...form.getInputProps('password')}
        />

        <TextInput
          required
          label={'Confirmation'}
          placeholder="DELETE"
          description="Enter 'DELETE' to confirm deletion"
          {...form.getInputProps('confirmation')}
        />

        <Flex justify={{ base: 'center', xs: 'end' }} gap={'xs'}>
          <Button
            variant="default"
            disabled={submitted}
            onClick={() => {
              form.reset();
              if (close) {
                close();
              }
            }}
          >
            Cancel
          </Button>

          <Button type="submit" color="red" loading={submitted}>
            {submitted ? 'Deleting Account' : 'Delete Account'}
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
