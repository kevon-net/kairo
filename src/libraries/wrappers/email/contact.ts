import resend from '@/libraries/resend';
import { isProduction } from '@/utilities/helpers/environment';
import { render } from '@react-email/render';
import EmailOnboardNewsletter from '@/components/email/onboard/newsletter';
import { appName } from '@/data/app';

export const contactCreateWelcome = async (params: { to: string }) => {
  const { data, error } = await resend.emails.send({
    from: `${appName} <${
      isProduction()
        ? process.env.NEXT_PUBLIC_EMAIL_NOREPLY!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [isProduction() ? params.to : process.env.NEXT_PUBLIC_EMAIL_INFO!],
    subject: `Welcome To ${appName} Newsletter`,
    html: await render(EmailOnboardNewsletter()),
    replyTo: process.env.NEXT_PUBLIC_EMAIL_NOREPLY!,
  });

  if (!error) {
    return data;
  } else {
    console.error(
      '---> wrapper error - (send email (onboard (newsletter))):',
      error
    );
    throw error;
  }
};
