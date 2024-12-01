import appData from '@/data/app';
import resend from '@/libraries/resend';

import EmailTransactionalConfirm from '@/components/email/transactional/off-board/confirm';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailTransactionalOffboardConfirm = async (
  to: EmailInquiry['to'],
  link: string
) => {
  const { data, error } = await resend.general.emails.send({
    from: `${appData.name.app} <${
      isProduction()
        ? process.env.NEXT_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? to : process.env.NEXT_EMAIL_INFO!],
    subject: `${appData.name.app} Account Deletion`,
    html: await render(EmailTransactionalConfirm({ params: { link } })),
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
