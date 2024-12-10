import { contactCreate } from '@/libraries/wrappers/email/contact';
import { NextRequest, NextResponse } from 'next/server';
import { EmailContactCreate } from '@/types/email';

export async function POST(request: NextRequest) {
  try {
    const contactOptions: EmailContactCreate = await request.json();

    const createContact = await contactCreate(contactOptions);

    if (createContact.exists) {
      return NextResponse.json(
        { error: "You're already a subscriber", exists: true },
        { status: 409, statusText: 'Already Subscribed' }
      );
    }

    return NextResponse.json(
      {
        contact: createContact,
        message: 'You have subscribed to the mailing list',
      },
      { status: 200, statusText: 'Subscribed' }
    );
  } catch (error) {
    console.error('---> route handler error (create contact):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
