import resend from '@/libraries/resend';
import EmailConfirm from '@/components/email/off-board/confirm';
import { isProduction } from '@/utilities/helpers/environment';
import { render } from '@react-email/render';
import { appName } from '@/data/app';

export const sendEmailTransactionalOffboardConfirm = async (params: {
  to: string;
  link: string;
  userName: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: `${appName} <${
      isProduction()
        ? process.env.NEXT_PUBLIC_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.to : process.env.NEXT_PUBLIC_EMAIL_INFO!],
    subject: `${appName} Account Deletion`,
    html: await render(
      EmailConfirm({ link: params.link, userName: params.userName })
    ),
    replyTo: process.env.NEXT_PUBLIC_EMAIL_NOREPLY!,
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
