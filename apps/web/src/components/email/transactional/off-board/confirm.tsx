import * as React from 'react';

import { Heading, Link, Section, Text } from '@react-email/components';

import appData from '@/data/app';

import LayoutEmail, { h2, section, text } from '../../layout';

export default function Confirm({ params }: { params: { link: string } }) {
  const message = `We want to make sure it's really you. Please click the following link to confirm the account deletion request. If you didn't request to delete your ${appData.name.app} account, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h2, marginBottom: '12px', textAlign: 'center' }}>
          Account Deletion
        </Heading>
        <Text style={text}>{message}</Text>
      </Section>

      <Section style={{ ...section, margin: '40px 0px' }}>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          <Link
            href={params.link}
            style={{ ...text, fontWeight: 'bold', fontSize: 24 }}
          >
            Delete Account
          </Link>
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
