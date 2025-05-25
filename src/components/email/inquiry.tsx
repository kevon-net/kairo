import * as React from 'react';
import { Text } from '@react-email/components';
import { Email as LayoutEmail, text } from './layout';
import { appName } from '@/data/app';

export const Inquiry = (props: { userName: string; userMessage: string }) => {
  return (
    <LayoutEmail
      props={{ preview: props.userMessage }}
      options={{ withHeader: true, withFooter: false }}
    >
      <Text>{appName},</Text>

      <Text style={text}>
        {props.userMessage || 'Sample text'} <br />
        <br />
        Regards, <br />
        {props.userName || 'John Doe'}
      </Text>
    </LayoutEmail>
  );
};

export default Inquiry;
