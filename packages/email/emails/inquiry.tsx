import * as React from 'react';

import { Text } from '@react-email/components';

import LayoutEmail, { text } from '../../layout';
import appData from '@/data/app';

export default function Inquiry(params: { name: string; message: string }) {
  return (
    <LayoutEmail
      props={{ preview: params.message }}
      options={{ withHeader: false, withFooter: false }}
    >
      <Text style={text}>
        {appData.name.company}, <br />
        {params.message} <br />
        <br />
        Regards, <br />
        {params.name}
      </Text>
    </LayoutEmail>
  );
}
