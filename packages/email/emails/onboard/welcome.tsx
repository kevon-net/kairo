import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function Welcome(props: { userName: string }) {
  const message = `Thanks creating an account with ${appData.name.app}.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          Welcome To {appData.name.company}
        </Heading>

        <Text style={text}>
          Hi {props.userName || 'John'},<br />
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
