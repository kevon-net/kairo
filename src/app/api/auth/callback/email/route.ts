import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS } from '@/data/constants';
import { profileCreate } from '@/services/database/profile';
import { getEmailLocalPart } from '@/utilities/helpers/string';
import { sendEmailTransactionalOnboard } from '@/libraries/wrappers/email/transactional/on-board';
import { segmentFullName } from '@/utilities/formatters/string';
import { contactCreate } from '@/handlers/requests/email/contact';

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
      firstName: getEmailLocalPart(verifyData.user?.email || ''),
    });

    const name = `${profile?.firstName} ${profile?.lastName || ''}`.trim();

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
        userName: profile?.userName,
      },
    });

    if (updateError) throw updateError;

    if (!existed && userData && userData.email) {
      await sendEmailTransactionalOnboard({
        to: userData.email,
        userName:
          segmentFullName(userData?.user_metadata.name).first || userData.email,
      });

      await contactCreate({
        params: { email: userData.email, name: userData.user_metadata.name },
        options: { notify: false },
      });
    }

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/';
    return NextResponse.redirect(next);
  } catch (error) {
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
