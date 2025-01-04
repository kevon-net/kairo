'use server';

import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS, BASE_URL } from '@/data/constants';
import { AuthAction } from '@/types/auth';

export const signIn = async (params: {
  formData: { email: string };
  options?: { action?: AuthAction; redirectUrl?: string };
}) => {
  try {
    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: params.formData.email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: params.options?.action == 'sign-up',
        emailRedirectTo: `${BASE_URL}${params.options?.redirectUrl || ''}`,
      },
    });

    if (signInError) throw signInError;

    const message =
      params.options?.action == 'sign-up'
        ? 'If the provided email is valid, a sign in magic link has been sent to your email.'
        : 'If an account with the provided email exists, a sign in magic link has been sent to your email.';

    return {
      redirect: `${AUTH_URLS.VERIFY_REQUEST}?message=${encodeURIComponent(message)}`,
    };
  } catch (error) {
    console.error(
      `---> event handler error (${params.options?.action}):`,
      error
    );

    if ((error as any).code == 'otp_disabled') {
      const message =
        'No account with the provided email exists, sign up instead';

      return {
        redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent(message)}`,
      };
    }

    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};

export const signUp = async (formData: { email: string; password: string }) => {
  try {
    const supabase = await createClient();
    const { error: signUpError } = await supabase.auth.signUp(formData);

    if (signUpError) throw signUpError;

    return { redirect: AUTH_URLS.VERIFY_REQUEST };
  } catch (error) {
    console.error('---> event handler error (sign up):', error);
    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};

export const signOut = async () => {
  try {
    const supabase = await createClient();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    return {
      redirect: BASE_URL,
    };
  } catch (error) {
    console.error('---> event handler error (sign out):', error);
    return {
      redirect: `${AUTH_URLS.ERROR}?message=${encodeURIComponent((error as Error).message)}`,
    };
  }
};
