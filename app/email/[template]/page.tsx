import React from 'react';

// import EmailMarketingContact from '@/components/email/marketing/contact';
// import { render } from '@react-email/render';
import { Paper } from '@mantine/core';

// const emails: Record<string, unknown> = {
//   contact: EmailMarketingContact({ name: 'Jane Doe', message: 'Sample' }),
// };

export default async function page({
  params,
}: {
  params: { template: string };
}) {
  return (
    <Paper p={'xl'} h={'100vh'}>
      <iframe
        src={`/api/email/preview?name=${encodeURIComponent(params.template)}`}
        style={{ width: '100%', height: '100%' }}
      />
    </Paper>
  );
}
