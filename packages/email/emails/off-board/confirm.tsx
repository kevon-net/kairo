import * as React from 'react';

import { Button, Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function Confirm(props: { link: string; userName: string }) {
  const message = `We want to make sure it's really you. Please click the following link to confirm the account deletion request. If you didn't request to delete your ${appData.name.app} account, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          Account Deletion
        </Heading>
        <Text style={text}>
          Hi {props.userName || 'John'},<br />
          {message}
        </Text>
      </Section>

      <Section style={{ ...section, margin: '40px 0px' }}>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          <Button
            href={props.link || '#'}
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
            Delete Account
          </Button>
        </Text>

        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          (this link is valid for 60 minutes)
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
