import * as React from 'react';

import { Heading, Section, Text } from '@react-email/components';

import appData from '../../src/data/app';

import LayoutEmail, { h1, section, text } from '../../src/layout';

export function Offboarded(props: { userName: string }) {
  const message = `${appData.name.app} is sorry to see you go.`;

  return (
    <LayoutEmail props={{ preview: message }}>
      <Section style={section}>
        <Heading style={{ ...h1, marginBottom: '32px' }}>
          We&apos;ve Had a Great Run
        </Heading>

        <Text style={text}>
          Hi {props.userName || 'John'},<br />
          Thanks for being a part of {appData.name.app}. This is to notify you
          that your account, and all its related data has been deleted.
        </Text>
      </Section>
    </LayoutEmail>
  );
}
