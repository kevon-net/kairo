import * as React from 'react';

import { CodeInline, Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function SignIn(props: { otp: string; userName: string }) {
  const message = `We want to make sure it's really you. Please use the following code for two-factor authentication. If you didn't attempt to sign in to your ${appData.name.app} account, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>Welcome Back!</Heading>

        <Text style={text}>
          Hi {props.userName || 'John'},<br />
          {message}
        </Text>
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
          <CodeInline>{props.otp || '465948'}</CodeInline>
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
