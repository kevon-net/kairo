import resend from '@/libraries/resend';
import EmailInquiry from '@/components/email/inquiry';
import { isProduction } from '@/utilities/helpers/environment';
import { EmailInquiry as TypeEmailInquiry } from '@/types/email';
import { render } from '@react-email/render';

export const sendEmailMarketingInquiry = async (params: {
  from: TypeEmailInquiry['from'];
  to: TypeEmailInquiry['to'];
  subject: TypeEmailInquiry['subject'];
  message: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: `${params.from.name} <${
      isProduction()
        ? process.env.NEXT_PUBLIC_EMAIL_INFO!
        : process.env.NEXT_RESEND_EMAIL!
    }>`,
    to: [process.env.NEXT_PUBLIC_EMAIL_INFO!],
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
