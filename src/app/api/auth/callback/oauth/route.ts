import { NextResponse } from 'next/server';
import { createClient } from '@/libraries/supabase/server';
import { profileCreate } from '@/services/database/profile';
import { segmentFullName } from '@/utilities/formatters/string';
import { AUTH_URLS } from '@/data/constants';
import { sendEmailTransactionalOnboard } from '@/libraries/wrappers/email/transactional/on-board';
import { contactCreate } from '@/handlers/requests/email/contact';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // const state = searchParams.get('state');
    // console.log('state', state);

    if (!code) {
      throw new Error('The link is broken');
    }

    const supabase = await createClient();

    const { error: exchangeError, data } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) throw exchangeError;

    // create profile if doesn't exist
    const { profile, existed } = await profileCreate({
      id: data.user?.id,
      firstName: segmentFullName(data.user.user_metadata.name || '').first,
      lastName: segmentFullName(data.user.user_metadata.name || '').last,
      phone: data.user.phone || '',
      avatar: data.user.user_metadata.avatar_url || '',
    });

    const name =
      `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

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
    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    return NextResponse.redirect(
      `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`
    );
  }
}
