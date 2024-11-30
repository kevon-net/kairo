import appData from '@/data/app';
import resend from '@/libraries/resend';

import EmailTransactionalAuthPasswordForgot from '@/components/email/transactional/auth/password-forgot';
import EmailTransactionalAuthPasswordChanged from '@/components/email/transactional/auth/password-changed';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalAuthPasswordForgot = async (
  otl: string,
  options: EmailInquiry['to']
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? options : process.env.NEXT_EMAIL_NOREPLY!],
    subject: 'Reset Your Password',
    html: await render(EmailTransactionalAuthPasswordForgot({ otl })),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error(
      '---> wrapper error - (send email (forgot password)):',
      error
    );

    throw error;
  }
};

export const sendEmailTransactionalAuthPasswordChanged = async (
  options: EmailInquiry['to']
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? options : process.env.NEXT_EMAIL_NOREPLY!],
    subject: `Password Changed`,
    html: await render(EmailTransactionalAuthPasswordChanged()),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error(
      '---> wrapper error - send email (password changed)):',
      error
    );

    throw error;
  }
};
