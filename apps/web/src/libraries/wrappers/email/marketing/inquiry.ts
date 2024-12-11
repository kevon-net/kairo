import resend from '@/libraries/resend';
import EmailTransactionalInquiry from '@/components/email/transactional/inquiry';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailMarketingInquiry = async (options: {
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
      EmailTransactionalInquiry({
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
