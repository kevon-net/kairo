import appData from '@/data/app';
import resend from '@/libraries/resend';

import EmailTransactionalOnboardWelcome from '@/components/email/transactional/onboard/welcome';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalOnboard = async (to: EmailInquiry['to']) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? to : process.env.NEXT_EMAIL_INFO!],
    subject: `Welcome To ${appData.name.app}`,
    html: await render(EmailTransactionalOnboardWelcome()),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (onboard)):', error);
    throw error;
  }
};
