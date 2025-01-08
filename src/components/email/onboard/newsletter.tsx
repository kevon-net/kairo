import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import appData from '@/data/app';
import { dimmedText, Email as LayoutEmail, text } from '../layout';

export const Newsletter = () => {
  const message = `You have successfully subscribed to the ${appData.name.app} newsletter. You will be recieving occational marketing and news emails.`;

  return (
    <LayoutEmail
      props={{
        preview: message,
        title: `${appData.name.app} Newsletter`,
      }}
    >
      <Section>
        <Text style={text}>
          Thank you for subscribing to the {appData.name.company} newsletter!
          We&apos;re excited to have you join our community. By signing up or
          subscribing, you&apos;ll receive the latest updates, exclusive
          insights, and helpful tips delivered straight to your inbox. We
          promise to keep our content relevant, engaging, and tailored to your
          interests. If you ever have questions, feedback, or suggestions for
          what you&apos;d like to see, feel free to contact us at{' '}
          <Link
            href={`mailto:${appData.emails.info}`}
            style={{
              color: 'gray',
              textDecorationLine: 'underline',
            }}
          >
            {appData.emails.info}
          </Link>
          . Welcome aboard—we&apos;re thrilled to keep you in the loop!
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

export default Newsletter;
