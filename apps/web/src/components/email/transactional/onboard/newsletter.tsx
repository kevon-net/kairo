import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h2, section, text } from '../../layout';

export default function Newsletter() {
  const message = `You have successfully subscribed to the ${appData.name.company} newsletter. You will be recieving occational marketing and news emails.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h2, marginBottom: '12px', textAlign: 'center' }}>
          Welcome To The {appData.name.company} Newsletter
        </Heading>
        <Text style={text}>
          You have successfully subscribed to the {appData.name.company}{' '}
          newsletter. You will be recieving occational marketing and news
          emails.
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
