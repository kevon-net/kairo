import * as React from 'react';

import { Button, Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function PasswordForgot(props: { otl: string; userName: string }) {
  const message = `Please use the following link to reset your password. If you don't want to reset your password or didn't request this email, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          Password Reset
        </Heading>

        <Text style={text}>
          Hi {props.userName || 'John'},<br />
          {message}
        </Text>
      </Section>

      <Section
        style={{
          ...section,
          margin: '40px 0px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Button
          href={props.otl || '#'}
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: 'black',
            fontSize: 24,
            borderRadius: '4px',
            padding: '8px 16px',
            fontWeight: 'bold',
            margin: '8px auto',
          }}
        >
          Reset Your Password
        </Button>

        <Text style={{ ...text, textAlign: 'center' }}>
          (this link is valid for 5 minutes)
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
