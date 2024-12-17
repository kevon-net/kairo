import appData from '@/data/app';
import resend from '@/libraries/resend';

import {
  EmailChanged as EmailEmailChanged,
  Verify as EmailVerify,
} from '@repo/email';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendTransactionalEmailAuthVerify = async (params: {
  otp: string;
  options: { to: EmailInquiry['to']; signUp?: boolean };
  userName: string;
}) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.options.to : process.env.NEXT_EMAIL_INFO!],
    subject: `Verify Your Email Address`,
    html: await render(
      EmailVerify({
        otp: params.otp,
        options: { signUp: params.options.signUp ?? true },
        userName: params.userName,
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

export const sendEmailTransactionalAuthEmailChanged = async (params: {
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
    subject: `Email Changed`,
    html: await render(EmailEmailChanged({ userName: params.userName })),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (email changed)):', error);

    throw error;
  }
};
