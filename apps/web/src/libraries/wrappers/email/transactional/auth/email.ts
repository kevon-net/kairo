import appData from '@/data/app';
import resend from '@/libraries/resend';

import EmailTransactionalEmailChanged from '@/components/email/transactional/auth/email-changed';
import EmailTransactionalAuthVerify from '@/components/email/transactional/auth/verify';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendTransactionalEmailAuthVerify = async (
  otp: string,
  options: { to: EmailInquiry['to']; signUp?: boolean }
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? options.to : process.env.NEXT_EMAIL_INFO!],
    subject: `Verify Your Email Address`,
    html: await render(
      EmailTransactionalAuthVerify({
        otp,
        options: { signUp: options.signUp ?? true },
      })
    ),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (email verify):', error);
    throw error;
  }
};

export const sendEmailTransactionalAuthEmailChanged = async (
  options: EmailInquiry['to']
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? options : process.env.NEXT_EMAIL_NOREPLY!],
    subject: `Email Changed`,
    html: await render(EmailTransactionalEmailChanged()),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (email changed)):', error);

    throw error;
  }
};
