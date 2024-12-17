import * as React from 'react';

import { Text } from '@react-email/components';

import appData from '../src/data/app';

import LayoutEmail, { text } from '../src/layout';
import sample from '../src/data/sample';

export function Inquiry(props: { userName: string; userMessage: string }) {
  return (
    <LayoutEmail
      props={{ preview: props.userMessage }}
      options={{ withHeader: false, withFooter: false }}
    >
      <Text style={text}>
        {appData.name.company}, <br />
        {props.userMessage || sample.text.prose} <br />
        <br />
        Regards, <br />
        {props.userName || 'John Doe'}
      </Text>
    </LayoutEmail>
  );
}
