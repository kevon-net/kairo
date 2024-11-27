import resend from '@/libraries/resend';
import TemplateEmailContact from '@/components/email/marketing/contact';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const emailCreateInquiry = async (options: {
  from: EmailInquiry['from'];
  to: EmailInquiry['to'];
  subject: EmailInquiry['subject'];
  message: string;
}) => {
  // switch to 'resend.general' when your domain is configured
  const { data, error } = await resend.general.emails.send({
    from: `${options.from.name} <${
      isProduction()
        ? process.env.NEXT_EMAIL_INFO!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [process.env.NEXT_EMAIL_INFO!],
    subject: options.subject,
    html: await render(
      TemplateEmailContact({
        name: options.from.name,
        message: options.message,
      })
    ),
    replyTo: options.to,
  });

  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (create (send) email inquiry):', error);
    throw error;
  }
};
