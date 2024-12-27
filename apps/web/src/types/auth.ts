import { AuthUser as SupabaseAuthUser } from '@supabase/supabase-js';

// {
//   avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocLTxn0kxjFMxcRaEQ1yvT47n53ngbw8yGwCxkLTbT2OGkn36XA=s96-c';
//   email: 'devokrann@gmail.com';
//   email_verified: true;
//   full_name: 'Kevon Kibochi';
//   iss: 'https://accounts.google.com';
//   name: 'Kevon Kibochi';
//   phone_verified: false;
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocLTxn0kxjFMxcRaEQ1yvT47n53ngbw8yGwCxkLTbT2OGkn36XA=s96-c';
//   provider_id: '118060041699730886648';
//   sub: '118060041699730886648';
// };

type UserMetadata = {
  avatar_url?: string;
  email?: string;
  email_verified?: true;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: false;
  picture?: string;
  provider_id?: string;
  sub?: string;
};

export type AuthUser = Omit<SupabaseAuthUser, 'user_metadata'> & {
  user_metadata: UserMetadata;
};

export type AuthAction = 'sign-up' | 'sign-in';
