import * as React from 'react';

import { CodeInline, Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function Verify(props: {
  otp: string;
  options?: { signUp?: boolean };
  userName: string;
}) {
  const message = `${!props.options?.signUp ? '' : `Thanks creating an account with ${appData.name.app}. `}We want to make sure it's really you. Please enter the following verification code to verify your account. If you don't want to create an account or didn't request this email, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          Verify Your Email Address
        </Heading>
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
          <CodeInline>{props.otp || '638923'}</CodeInline>
        </Text>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          (this code is valid for 1 hour)
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
