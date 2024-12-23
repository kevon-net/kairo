import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/libraries/supabase/server';
import { BASE_URL } from '@/data/constants';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(`${BASE_URL}${next}`);
    }

    return NextResponse.json(
      { error: error.message },
      { status: 403, statusText: 'Verification Failed' }
    );
  }

  return NextResponse.json(
    { error: 'Failed to verfy email' },
    { status: 403, statusText: 'Verification Failed' }
  );
}
