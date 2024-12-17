import * as React from 'react';

import { Heading, Link, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function EmailChanged(props: { userName: string }) {
  const message = `You have successfully changed your email. If you didn't initiate this process, contact support immediately via the link provided below.`;

  const supportEmail = appData.emails.info;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>Email Updated</Heading>

        <Text style={text}>
          Hi {props.userName || 'John'},<br />
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
