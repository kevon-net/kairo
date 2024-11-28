import { render } from '@react-email/render';
import { NextRequest, NextResponse } from 'next/server';

import EmailMarketingContact from '@/components/email/marketing/contact';
import EmailAuthPasswordChanged from '@/components/email/auth/password-changed';
import EmailAuthPasswordForgot from '@/components/email/auth/password-forgot';
import EmailAuthSignIn from '@/components/email/auth/sign-in';
import EmailAuthVerify from '@/components/email/auth/verify';

import { baseUrl } from '@/data/constants';
import { generateOtpCode } from '@/utilities/generators/otp';
import sample from '@/data/sample';

const emails: Record<string, any> = {
  contact: EmailMarketingContact({
    name: 'Jane Doe',
    message: sample.text.prose,
  }),
  passwordChanged: EmailAuthPasswordChanged(),
  passwordForgot: EmailAuthPasswordForgot({ otl: baseUrl }),
  signIn: EmailAuthSignIn({ otp: String(generateOtpCode()) }),
  signUp: EmailAuthVerify({
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
