import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/libraries/supabase/server';
import { profileCreate } from '@/services/database/profile';
import { segmentFullName } from '@repo/utils/formatters';
import { AUTH_URLS } from '@/data/constants';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('The link is broken');
    }

    const supabase = await createClient();

    const { error: exchangeError, data } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) throw exchangeError;

    // create profile if doesn't exist
    const profile = await profileCreate({
      id: data.user?.id,
      firstName: segmentFullName(data.user.user_metadata.name || '').first,
      lastName: segmentFullName(data.user.user_metadata.name || '').last,
      phone: data.user.phone || '',
      avatar: data.user.user_metadata.avatar_url || '',
    });

    const name = `${profile?.firstName} ${profile?.lastName}`.trim();

    // update user
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        full_name: name,
        picture: profile?.avatar,
        avatar_url: profile?.avatar,
        userName: profile?.userName,
      },
    });

    if (updateError) throw updateError;

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
