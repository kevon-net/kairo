import { CreateEmailOptions } from 'resend';

export type EmailInquiry = Omit<CreateEmailOptions, 'from' | 'to'> & {
  from: { name: string; email: string };
  to: string;
};
