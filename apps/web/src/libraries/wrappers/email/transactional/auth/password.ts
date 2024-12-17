import appData from '@/data/app';
import resend from '@/libraries/resend';

import {
  PasswordForgot as EmailPasswordForgot,
  PasswordChanged as EmailPasswordChanged,
} from '@repo/email';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalAuthPasswordForgot = async (params: {
  otl: string;
  options: EmailInquiry['to'];
  userName: string;
}) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.options : process.env.NEXT_EMAIL_NOREPLY!],
    subject: 'Reset Your Password',
    html: await render(
      EmailPasswordForgot({ otl: params.otl, userName: params.userName })
    ),
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

export const sendEmailTransactionalAuthPasswordChanged = async (params: {
  options: EmailInquiry['to'];
  userName: string;
}) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.options : process.env.NEXT_EMAIL_NOREPLY!],
    subject: `Password Changed`,
    html: await render(EmailPasswordChanged({ userName: params.userName })),
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
