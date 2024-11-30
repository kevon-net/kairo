import { render } from '@react-email/render';
import { NextRequest, NextResponse } from 'next/server';

import EmailTransactionalInquiry from '@/components/email/transactional/inquiry';
import EmailTransactionalAuthPasswordChanged from '@/components/email/transactional/auth/password-changed';
import EmailTransactionalAuthPasswordForgot from '@/components/email/transactional/auth/password-forgot';
import EmailTransactionalAuthSignIn from '@/components/email/transactional/auth/sign-in';
import EmailTransactionalAuthVerify from '@/components/email/transactional/auth/verify';

import { baseUrl } from '@/data/constants';
import { generateOtpCode } from '@/utilities/generators/otp';
import sample from '@/data/sample';

const emails: Record<string, any> = {
  contact: EmailTransactionalInquiry({
    name: 'Jane Doe',
    message: sample.text.prose,
  }),
  passwordChanged: EmailTransactionalAuthPasswordChanged(),
  passwordForgot: EmailTransactionalAuthPasswordForgot({ otl: baseUrl }),
  signIn: EmailTransactionalAuthSignIn({ otp: String(generateOtpCode()) }),
  signUp: EmailTransactionalAuthVerify({
    otp: String(generateOtpCode()),
    options: { signUp: true },
  }),
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const templateName = searchParams.get('name') || undefined;

  const emailComponent = emails[templateName!];

  if (!emailComponent) {
    return new NextResponse('Email template not found', {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const html = await render(emailComponent, { pretty: true });

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
