import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS } from '@/data/constants';
import { profileCreate } from '@/services/database/profile';
import { getEmailLocalPart } from '@/utilities/helpers/string';
import { emailSendOnboardSignUp } from '@/libraries/wrappers/email/on-board/sign-up';
import { segmentFullName } from '@/utilities/formatters/string';
import { contactAdd } from '@/services/api/email/contacts';
import { getSafeRedirectUrl } from '@/utilities/helpers/url';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    if (!token_hash || !type) {
      throw new Error('The link is broken');
    }

    const supabase = await createClient();

    const { data: verifyData, error: verifyError } =
      await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

    if (verifyError) throw verifyError;

    // create profile if doesn't exist
    const { profile, existed } = await profileCreate({
      id: verifyData.user?.id || '',
      first_name: getEmailLocalPart(verifyData.user?.email || ''),
    });

    const name = `${profile?.first_name} ${profile?.last_name || ''}`.trim();

    // update user
    const {
      data: { user: userData },
      error: updateError,
    } = await supabase.auth.updateUser({
      data: {
        name,
        full_name: name,
        picture: profile?.avatar,
        avatar_url: profile?.avatar,
        userName: profile?.user_name,
      },
    });

    if (updateError) throw updateError;

    if (!existed && userData && userData.email) {
      await emailSendOnboardSignUp({
        to: userData.email,
        userName:
          segmentFullName(userData?.user_metadata.name).first || userData.email,
      });

      await contactAdd(
        { email: userData.email, name: userData.user_metadata.name },
        false
      );
    }

    // if "next" is in param, use it as the redirect URL
    const redirectUrl = getSafeRedirectUrl(request, 'next');
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
