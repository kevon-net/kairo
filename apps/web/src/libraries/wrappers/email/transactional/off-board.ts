import appData from '@/data/app';
import resend from '@/libraries/resend';

import { Confirm as EmailConfirm } from '@repo/email';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalOffboardConfirm = async (params: {
  to: EmailInquiry['to'];
  link: string;
  userName: string;
}) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.to : process.env.NEXT_EMAIL_INFO!],
    subject: `${appData.name.app} Account Deletion`,
    html: await render(
      EmailConfirm({ link: params.link, userName: params.userName })
    ),
    replyTo: process.env.NEXT_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error(
      '---> wrapper error - (send email (off board confirm)):',
      error
    );
    throw error;
  }
};
