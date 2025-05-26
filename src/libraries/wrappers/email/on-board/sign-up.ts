import resend from '@/libraries/resend';
import EmailOnboardWelcome from '@/components/email/onboard/welcome';
import { isProduction } from '@/utilities/helpers/environment';
import { render } from '@react-email/render';
import { appName } from '@/data/app';

export const emailSendOnboardSignUp = async (params: {
  to: string;
  userName: string;
}) => {
  const devEmail = process.env.NEXT_PUBLIC_EMAIL_DEV || '';
  const noReplyEmail = process.env.NEXT_PUBLIC_EMAIL_NOREPLY || '';

  const { data, error } = await resend.emails.send({
    from: `${appName} <${noReplyEmail}>`,
    to: [isProduction() ? params.to : devEmail],
    subject: `Welcome To ${appName}`,
    replyTo: noReplyEmail,
    html: await render(EmailOnboardWelcome({ userName: params.userName })),
  });
  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send sign-up onboard email):', error);
    throw error;
  }
};
