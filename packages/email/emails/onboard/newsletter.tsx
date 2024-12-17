import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function Newsletter() {
  const message = `You have successfully subscribed to the ${appData.name.company} newsletter. You will be recieving occational marketing and news emails.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          Welcome To The {appData.name.company} Newsletter
        </Heading>

        <Text style={text}>
          You have successfully subscribed to the {appData.name.company}{' '}
          newsletter. You will be recieving occational marketing and news
          emails.
        </Text>
      </Section>
    </LayoutEmail>
  );
}
