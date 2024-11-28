'use client';

import React from 'react';

import {
  Box,
  Button,
  Center,
  Grid,
  GridCol,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useFormEmailInquiry } from '@/hooks/form/email/inquiry';
import TooltipInputInfo from '../common/tooltips/input/info';

export default function Contact() {
  const { form, submitted, handleSubmit } = useFormEmailInquiry();

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Grid pb={'md'}>
        <GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
          <TextInput
            required
            label={'Name'}
            placeholder="Your Name"
            {...form.getInputProps('from.name')}
          />
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
          <TextInput
            label={'Phone'}
            placeholder="Your Phone"
            {...form.getInputProps('phone')}
          />
        </GridCol>
        <GridCol span={{ base: 12 }}>
          <TextInput
            required
            label={'Email'}
            placeholder="Your Email"
            {...form.getInputProps('from.email')}
            rightSection={<TooltipInputInfo />}
          />
        </GridCol>
        <GridCol span={12}>
          <TextInput
            required
            label="Subject"
            placeholder="What are you inquiring about?"
            {...form.getInputProps('subject')}
          />
        </GridCol>
        <GridCol span={12}>
          <Textarea
            required
            label={'Message'}
            placeholder="Write your message here..."
            autosize
            minRows={7}
            maxRows={15}
            resize="vertical"
            {...form.getInputProps('message')}
          />
        </GridCol>
        <GridCol span={12}>
          <Grid mt={'md'}>
            <GridCol span={{ base: 6 }}>
              {/* <Center>
								<Button
									variant="light"
									fullWidth
									type="reset"
									onClick={() => form.reset()}
									disabled={submitted}
								>
									Clear
								</Button>
							</Center> */}
            </GridCol>
            <GridCol span={{ base: 6 }}>
              <Center>
                <Button fullWidth type="submit" loading={submitted}>
                  {submitted ? 'Sending' : 'Send'}
                </Button>
              </Center>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </Box>
  );
}
