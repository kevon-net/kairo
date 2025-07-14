import resend from '@/libraries/resend';
import EmailOnboardWelcome from '@/components/email/onboard/welcome';
import { isProduction } from '@/utilities/helpers/environment';
import { render } from '@react-email/render';
import { appName } from '@/data/app';

export const sendEmailTransactionalOnboard = async (params: {
  to: string;
  userName: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: `${appName} <${
      isProduction()
        ? process.env.NEXT_PUBLIC_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.to : process.env.NEXT_PUBLIC_EMAIL_INFO!],
    subject: `Welcome To ${appName}`,
    html: await render(EmailOnboardWelcome({ userName: params.userName })),
    replyTo: process.env.NEXT_PUBLIC_EMAIL_NOREPLY!,
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send email (onboard)):', error);
    throw error;
  }
};
