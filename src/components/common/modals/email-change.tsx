'use client';

import React from 'react';

import {
  Modal,
  Button,
  Stack,
  Text,
  Group,
  Title,
  PinInput,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormUserEmail } from '@/hooks/form/account/email';

export default function EmailChange() {
  const [opened, { open, close }] = useDisclosure(false);
  const {
    formCode,
    formEmail,
    submitted,
    context,
    code1Sent,
    code2Sent,

    code1Send,
    handleSubmitCode1,

    code2Send,
    handleSubmitCode2,

    session,
  } = useFormUserEmail(close);

  const getButtonProps = () =>
    context == 'email1'
      ? code1Sent
        ? {
            event: handleSubmitCode1,
            children: submitted ? 'Verifying' : 'Verify',
          }
        : { event: code1Send, children: submitted ? 'Sending' : 'Send' }
      : code2Sent
        ? {
            event: handleSubmitCode2,
            children: submitted ? 'Verifying' : 'Verify',
          }
        : { event: code2Send, children: submitted ? 'Sending' : 'Send' };

  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Change Email">
        <Stack>
          {context == 'email1' && (
            <Text>
              Your current email is{' '}
              <Text component="span" inherit fw={'bold'}>
                {session?.user.email}
              </Text>
              . {code1Sent ? "We've sent" : "We'll send"} a temporary
              verification code to this email.
            </Text>
          )}

          {context == 'email2' && (
            <Stack>
              {code2Sent ? (
                <Text>
                  We&apos;ve sent a temporary verification code to{' '}
                  <Text component="span" inherit fw={'bold'}>
                    {formEmail.values.email}
                  </Text>
                  . Remember to check the spam/junk folder(s).
                </Text>
              ) : (
                <Text>
                  Provide your new email and we will send you a verification
                  code.
                </Text>
              )}

              {!code2Sent && (
                <TextInput
                  required
                  label="New Email"
                  placeholder="Your new email"
                  {...formEmail.getInputProps('email')}
                  error={formEmail.errors.email}
                />
              )}
            </Stack>
          )}

          {(code1Sent || code2Sent) && (
            <PinInput
              {...formCode.getInputProps('otp')}
              type={'number'}
              length={6}
              oneTimeCode
              styles={{ input: { fontWeight: 'bold' } }}
            />
          )}

          <Group justify="end">
            <Button
              onClick={() => getButtonProps().event()}
              loading={submitted}
            >
              {getButtonProps().children}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Group justify="space-between">
        <Stack gap={0}>
          <Title order={4} fz={'md'}>
            Current Email
          </Title>

          <Text fz={'sm'}>{session?.user.email}</Text>
        </Stack>

        <Button onClick={open}>Change Email</Button>
      </Group>
    </>
  );
}
