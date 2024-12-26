'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS } from '@/data/constants';

export const signIn = async (formData: { email: string; password: string }) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp(formData);

  if (error) {
    redirect(`${AUTH_URLS.ERROR}?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
};

export const signUp = async (formData: { email: string; password: string }) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(formData);

  if (error) {
    redirect(`${AUTH_URLS.ERROR}?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect(AUTH_URLS.VERIFY_REQUEST);
};

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(`${AUTH_URLS.ERROR}?message=${error.message}`);
  }
};
