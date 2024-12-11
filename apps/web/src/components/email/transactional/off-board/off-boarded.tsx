import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h2, section, text } from '@/components/layout/email';

export default function Offboarded() {
  const message = `${appData.name.app} is sorry to see you go.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h2, marginBottom: '12px', textAlign: 'center' }}>
          We&apos;ve Had a Great Run
        </Heading>
        <Text style={text}>Thanks for being a part of {appData.name.app}.</Text>
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
