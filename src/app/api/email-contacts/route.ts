import { NextRequest, NextResponse } from 'next/server';
import { contactAdd } from '@/services/api/email/contacts';
import { FormInquiryValues } from '@/hooks/form/inquiry';

export async function POST(request: NextRequest) {
  try {
    const formValues: Partial<FormInquiryValues> = await request.json();

    const response = await contactAdd(formValues, true);

    const result = await response.json();

    return new NextResponse(JSON.stringify({ ...result }), {
      status: response.status,
      statusText: 'Subscriber Added',
    });
  } catch (error) {
    console.error('---> route handler error (add email contact):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
