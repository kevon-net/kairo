'use client';

import React from 'react';

import {
  Box,
  Button,
  Grid,
  GridCol,
  PasswordInput,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';

import { useFormUserAccountPassword } from '@/hooks/form/account/password';
import PopoverPasswordStrength from '@/components/wrapper/popovers/password-strength';
import ModalPasswordReset from '@/components/common/modals/password-reset';

import classes from './notifications.module.scss';
import { useAppSelector } from '@/hooks/redux';

export default function Password() {
  const session = useAppSelector((state) => state.session.value);

  const { form, sending, handleSubmit } = useFormUserAccountPassword({
    credentials: !session ? false : session.user.withPassword,
  });

  const getLabel = ({ title, desc }: { title: string; desc?: string }) => (
    <Stack gap={0}>
      <Title order={4} fz={'md'}>
        {title}
      </Title>
      {desc && <Text fz={'sm'}>{desc}</Text>}
    </Stack>
  );

  const keepOn = session?.user.withPassword == true;

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid>
        <GridCol span={{ base: 12 }}>
          <Switch
            classNames={{
              body: classes.body,
              labelWrapper: classes.labelWrapper,
            }}
            labelPosition="left"
            label={getLabel({
              title: 'Use Password',
              desc: 'Set a permanent password to login to your account.',
            })}
            key={form.key('credentials')}
            {...form.getInputProps(keepOn ? '' : 'credentials')}
            defaultChecked={session?.user.withPassword}
            checked={keepOn ? true : undefined}
          />
        </GridCol>

        <GridCol span={{ base: 12, md: 8, lg: 6 }}>
          <Grid>
            {form.values.credentials && (
              <>
                {session?.user.withPassword && (
                  <GridCol span={12}>
                    <PasswordInput
                      required
                      label={'Current Password'}
                      placeholder="********"
                      {...form.getInputProps('current')}
                      description={
                        <>
                          If you can&apos;t remember, you can{' '}
                          <ModalPasswordReset>
                            reset your password
                          </ModalPasswordReset>
                          .
                        </>
                      }
                    />
                  </GridCol>
                )}

                <GridCol span={{ base: 12, xs: 6 }}>
                  <PopoverPasswordStrength
                    required
                    label={'New Password'}
                    placeholder="********"
                    value={form.values.password.initial}
                    {...form.getInputProps('password.initial')}
                  />
                </GridCol>

                <GridCol span={{ base: 12, xs: 6 }}>
                  <PasswordInput
                    required
                    label={'Confirm New Password'}
                    placeholder="********"
                    {...form.getInputProps('password.confirm')}
                  />
                </GridCol>

                <GridCol span={{ base: 6 }}>
                  <Button type="submit" color="pri" loading={sending} mt={'md'}>
                    {sending ? 'Updating' : 'Update'}
                  </Button>
                </GridCol>
              </>
            )}
          </Grid>
        </GridCol>
      </Grid>
    </Box>
  );
}
