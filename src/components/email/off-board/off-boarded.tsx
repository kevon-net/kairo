import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import appData from '@/data/app';
import { dimmedText, Email as LayoutEmail, text } from '../layout';

export const Offboarded = (props: { userName: string }) => {
  const message = `${appData.name.app} is sorry to see you go.`;

  return (
    <LayoutEmail props={{ preview: message, title: 'Account Deleted' }}>
      <Section>
        <Text style={{ marginTop: 0 }}>Hi {props.userName || 'John'},</Text>

        <Text style={text}>
          We&apos;re sorry to see you go, but your account with{' '}
          {appData.name.app} has been successfully deleted. All your data has
          been securely removed from our system in accordance with our privacy
          policy. If you ever decide to return, we&apos;d be delighted to
          welcome you back and help you get started again. In the meantime, if
          you have any questions, feedback, or need further assistance,
          don&apos;t hesitate to reach out to us at{' '}
          <Link
            href={`mailto:${appData.emails.info}`}
            style={{
              color: 'gray',
              textDecorationLine: 'underline',
            }}
          >
            {appData.emails.info}
          </Link>
          . Thank you for being a part of {appData.name.app}.
        </Text>
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Hr />
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Text style={dimmedText}>
          {appData.name.app} will never email you and ask you to disclose any
          sensitive personal information.
        </Text>
      </Section>
    </LayoutEmail>
  );
};
export default Offboarded;
