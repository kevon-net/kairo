'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/libraries/supabase/server';
import { AUTH_URLS } from '@/data/constants';

export const signIn = async (formData: { email: string; password: string }) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error, data: userData } =
    await supabase.auth.signInWithPassword(data);

  console.log('userData', userData);
  console.log('error', error);

  if (error) {
    redirect(`${AUTH_URLS.ERROR}?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
};

export const signUp = async (formData: { email: string; password: string }) => {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(`${AUTH_URLS.ERROR}?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect(AUTH_URLS.VERIFY_REQUEST);
};
