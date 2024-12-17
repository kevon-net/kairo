import * as React from 'react';

import { Heading, Link, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h1, section, text } from '../../layout';

export default function PasswordForgot(params: { otl: string }) {
  const message = `Please use the following link to reset your password. If you don't want to reset your password or didn't request this email, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '12px', textAlign: 'center' }}>
          Password Reset
        </Heading>
        <Text style={text}>{message}</Text>
      </Section>

      <Section style={{ ...section, margin: '40px 0px' }}>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          <Link
            href={params.otl}
            style={{ ...text, fontWeight: 'bold', fontSize: 24 }}
          >
            Reset Your Password
          </Link>
        </Text>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
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
