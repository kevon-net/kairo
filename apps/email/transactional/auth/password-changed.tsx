import * as React from 'react';

import { Heading, Link, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h2, section, text } from '@/components/layout/email';

export default function PasswordChanged() {
  const message = `You have successfully changed your password. If you didn't initiate this process, contact support immediately via the link provided below.`;

  const supportEmail = appData.emails.info;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h2, marginBottom: '12px', textAlign: 'center' }}>
          Password Updated
        </Heading>
        <Text style={text}>
          {message} If this was not you,{' '}
          <Link href={`mailto:${supportEmail}`} style={{ fontWeight: 'bold' }}>
            contact support
          </Link>{' '}
          immediately.
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
