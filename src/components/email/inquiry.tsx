import * as React from 'react';
import { Text } from '@react-email/components';
import appData from '@/data/app';
import { Email as LayoutEmail, text } from './layout';
import sample from '@/data/sample';

export const Inquiry = (props: { userName: string; userMessage: string }) => {
  return (
    <LayoutEmail
      props={{ preview: props.userMessage }}
      options={{ withHeader: true, withFooter: false }}
    >
      <Text>{appData.name.company},</Text>

      <Text style={text}>
        {props.userMessage || sample.text.prose} <br />
        <br />
        Regards, <br />
        {props.userName || 'John Doe'}
      </Text>
    </LayoutEmail>
  );
};

export default Inquiry;
