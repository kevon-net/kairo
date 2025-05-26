import resend from '@/libraries/resend';
import EmailInquiry from '@/components/email/inquiry';
import { isProduction } from '@/utilities/helpers/environment';
import { render } from '@react-email/render';
import { FormInquiryValues } from '@/hooks/form/inquiry';

export const sendEmailMarketingInquiry = async (
  params: FormInquiryValues,
  recipient: string
) => {
  const devEmail = process.env.NEXT_PUBLIC_EMAIL_DEV || '';
  const deliveryEmail = process.env.NEXT_PUBLIC_EMAIL_DELIVERY || '';

  const { data, error } = await resend.emails.send({
    from: `${params.name} <${deliveryEmail}>`,
    to: [!isProduction() ? devEmail : recipient],
    subject: `${params.subject} (From ${params.name})`,
    replyTo: params.email,
    html: await render(
      EmailInquiry({
        userName: params.name,
        userMessage: params.message,
        userPhone: params.phone,
      })
    ),
  });

  if (!error) {
    return data;
  } else {
    console.error('---> wrapper error - (send inquiry email):', error);
    throw error;
  }
};
