import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h1, section, text } from '../../layout';

export default function SignIn(params: { otp: string }) {
  const message = `We want to make sure it's really you. Please use the following code for two-factor authentication. If you didn't attempt to sign in to your ${appData.name.app} account, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '12px', textAlign: 'center' }}>
          Welcome Back!
        </Heading>
        <Text style={text}>{message}</Text>
      </Section>

      <Section style={{ ...section, margin: '40px 0px' }}>
        <Text
          style={{
            ...text,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 24,
          }}
        >
          {params.otp}
        </Text>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          (this code is valid for 5 minutes)
        </Text>
      </Section>

      <Section style={section}>
        <Text style={text}>
          {appData.name.app} will never email you and ask you to disclose or
          verify your password, credit card, banking account number or any other
          sensitive personal information.
        </Text>
      </Section>
    </LayoutEmail>
  );
}
