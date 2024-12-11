import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h2, section, text } from '@/components/layout/email';

export default function Welcome() {
  const message = `Thanks creating an account with ${appData.name.app}.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h2, marginBottom: '12px', textAlign: 'center' }}>
          Welcome To {appData.name.company}
        </Heading>
        <Text style={text}>
          Thanks creating an account with {appData.name.app}.
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
