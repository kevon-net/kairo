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
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormUserEmail } from '@/hooks/form/account/email';
import TooltipInputInfo from '../tooltips/input/info';
import LayoutModal from '@/components/layout/modal';
import { Alert } from '@repo/enums';

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

  const getProps = () =>
    context == 'email1'
      ? code1Sent
        ? {
            title: 'Verify Email',
            event: handleSubmitCode1,
            children: submitted ? 'Verifying' : 'Verify',
          }
        : {
            title: 'Change Email',
            event: code1Send,
            children: submitted ? 'Sending' : 'Send',
          }
      : code2Sent
        ? {
            title: 'Verify Email',
            event: handleSubmitCode2,
            children: submitted ? 'Verifying' : 'Verify',
          }
        : {
            title: 'Change Email',
            event: code2Send,
            children: submitted ? 'Sending' : 'Send',
          };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        padding={'xl'}
        size={'lg'}
      >
        <Stack>
          <LayoutModal
            props={{
              title: getProps().title || '',
              close,
            }}
            variant={Alert.WARNING}
          >
            <Stack>
              {context == 'email1' && (
                <Text ta={{ base: 'center', xs: 'start' }}>
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
                    <Text ta={{ base: 'center', xs: 'start' }}>
                      We&apos;ve sent a temporary verification code to{' '}
                      <Text component="span" inherit fw={'bold'}>
                        {formEmail.values.email}
                      </Text>
                      . Remember to check the spam/junk folder(s).
                    </Text>
                  ) : (
                    <Text ta={{ base: 'center', xs: 'start' }}>
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
                      rightSection={<TooltipInputInfo />}
                    />
                  )}
                </Stack>
              )}

              {(code1Sent || code2Sent) && (
                <Flex justify={{ base: 'center', xs: 'start' }}>
                  <PinInput
                    {...formCode.getInputProps('otp')}
                    type={'number'}
                    length={6}
                    oneTimeCode
                    styles={{ input: { fontWeight: 'bold' } }}
                  />
                </Flex>
              )}

              <Flex justify={{ base: 'center', xs: 'end' }} gap={'xs'}>
                <Button
                  color="yellow"
                  onClick={() => getProps().event()}
                  loading={submitted}
                >
                  {getProps().children}
                </Button>
              </Flex>
            </Stack>
          </LayoutModal>
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
