import appData from '@/data/app';
import resend from '@/libraries/resend';

import { Welcome as EmailOnboardWelcome } from '@repo/email';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalOnboard = async (params: {
  to: EmailInquiry['to'];
  userName: string;
}) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.to : process.env.NEXT_EMAIL_INFO!],
    subject: `Welcome To ${appData.name.app}`,
    html: await render(EmailOnboardWelcome({ userName: params.userName })),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (onboard)):', error);
    throw error;
  }
};
