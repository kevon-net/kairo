import resend from '@/libraries/resend';
import { Inquiry as EmailInquiry } from '@repo/email';
import { isProduction } from '@repo/utils/helpers';
import { EmailInquiry as TypeEmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailMarketingInquiry = async (params: {
  from: TypeEmailInquiry['from'];
  to: TypeEmailInquiry['to'];
  subject: TypeEmailInquiry['subject'];
  message: string;
}) => {
  // switch to 'resend.general' when your domain is configured
  const { data, error } = await resend.general.emails.send({
    from: `${params.from.name} <${
      isProduction()
        ? process.env.NEXT_EMAIL_INFO!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [process.env.NEXT_EMAIL_INFO!],
    subject: params.subject,
    html: await render(
      EmailInquiry({ userName: params.from.name, userMessage: params.message })
    ),
    replyTo: params.to,
  });

  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (create (send) email inquiry):', error);
    throw error;
  }
};
