import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import appData from '@/data/app';
import { dimmedText, Email as LayoutEmail, text } from '../layout';

export const Welcome = (props: { userName: string }) => {
  const message = `Thanks for creating an account with ${appData.name.app}.`;

  return (
    <LayoutEmail
      props={{ preview: message, title: `Welcome To ${appData.name.company}` }}
    >
      <Section>
        <Text>Hi {props.userName || 'John'},</Text>

        <Text style={text}>
          Welcome to {appData.name.app}! We&apos;re thrilled to have you on
          board. With your new account, you&apos;ll have access to key features
          and benefits of our service. We&apos;re committed to helping you every
          step of the way. If you have any questions or need assistance, feel
          free to reach out to us at{' '}
          <Link
            href={`mailto:${appData.emails.info}`}
            style={{
              color: 'gray',
              textDecorationLine: 'underline',
            }}
          >
            {appData.emails.info}
          </Link>
          . Let&apos;s get started on this exciting journey together!
        </Text>
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Hr />
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Text style={dimmedText}>
          If you didn&apos;t create an account with {appData.name.app}, you can
          safely ignore this email.
        </Text>
      </Section>
    </LayoutEmail>
  );
};

export default Welcome;
