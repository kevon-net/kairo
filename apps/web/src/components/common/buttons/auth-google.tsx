'use client';
import Script from 'next/script';
import { createClient } from '@/libraries/supabase/client';
import { CredentialResponse } from '@/types/google-one-tap';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGoogle() {
  const supabase = createClient();
  const router = useRouter();

  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

  const handleGoogleSignIn = async (
    response: CredentialResponse,
    nonce: string
  ) => {
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce,
      });

      if (error) throw error;

      router.push('/');
    } catch (error) {
      console.error('Error logging in with Google One Tap', error);
    }
  };

  const initializeGoogleOneTap = async () => {
    const [nonce, hashedNonce] = await generateNonce();

    // Check for existing session
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session) {
      return;
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID || '',
        callback: (response: CredentialResponse) => {
          console.log('response.credential', response.credential);
          handleGoogleSignIn(response, nonce);
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      window.google.accounts.id.prompt();
    }
  };

  useEffect(() => {
    // Wait for the script to load before initializing
    const handleLoad = () => {
      initializeGoogleOneTap();
    };

    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, [router]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogleOneTap}
      />

      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
}
