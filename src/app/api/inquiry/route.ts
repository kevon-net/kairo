import { NextRequest, NextResponse } from 'next/server';
import { sendEmailMarketingInquiry } from '@/libraries/wrappers/email/inquiry';
import { contactAdd } from '@/services/api/email/contacts';
import { FormInquiryValues } from '@/hooks/form/inquiry';

export async function POST(request: NextRequest) {
  try {
    const formData: FormInquiryValues & { recipient: string } =
      await request.json();

    // send email
    const sendMail = await sendEmailMarketingInquiry(
      formData,
      formData.recipient
    );

    // add email contact to subscriber list
    const addContact = await contactAdd(formData);

    return NextResponse.json(
      {
        sendMail,
        addContact,
        message: 'Email sent successfully',
      },
      { status: 200, statusText: 'Email Sent' }
    );
  } catch (error) {
    console.error('---> route handler error (send inquiry):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
