import appData from '@/data/app';
import resend from '@/libraries/resend';

import TemplateEmailCodeSignUp from '@/components/email/auth/sign-up';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const emailCreateSignUp = async (
  otp: string,
  options: EmailInquiry['to']
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? options : process.env.NEXT_EMAIL_INFO!],
    subject: `Verify Your Email Address`,
    html: await render(TemplateEmailCodeSignUp({ otp })),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (email send sign up):', error);
    throw error;
  }
};
