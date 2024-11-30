import { CreateEmailOptions } from 'resend';

export type EmailInquiry = Omit<CreateEmailOptions, 'from' | 'to'> & {
  from: { name: string; email: string };
  to: string;
};

export type EmailContactCreate = {
  params: Omit<EmailInquiry['from'], 'name'> & { name?: string };
  options?: { notify?: boolean };
};
