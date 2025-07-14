'use client';

import { API_URL, AUTH_URLS, PARAM_NAME } from '@/data/constants';
import { getUrlParam } from '@/utilities/helpers/url';
import { useState } from 'react';

export const useFormAuthConfirmEmail = () => {
  const [status, setStatus] = useState<{
    state: 'loading' | 'error' | 'success' | null;
    message?: string;
  }>({ state: null, message: 'Click the button below to verify your email.' });

  const handleTrigger = async () => {
    setStatus({
      state: 'loading',
      message: 'Please wait while we verify your email.',
    });

    const endpoint = `${API_URL}/auth/callback/email`;
    const token = getUrlParam('token_hash');
    const type = getUrlParam('type');
    const redirect = getUrlParam(PARAM_NAME.REDIRECT_AUTH);
    const next = encodeURIComponent(redirect || AUTH_URLS.REDIRECT.DEFAULT);
    const redirectUrl = `${endpoint}?token_hash=${token}&type=${type}&next=${next}`;
    window.location.href = redirectUrl;
  };

  return { status, handleTrigger };
};

export const useFormAuthConfirmSignIn = () => {
  const [status, setStatus] = useState<{
    state: 'loading' | 'error' | 'success' | null;
    message?: string;
  }>({
    state: null,
    message: 'Click the button below to access your personalized experience.',
  });

  const handleTrigger = async () => {
    setStatus({
      state: 'loading',
      message: 'Please wait while we verify the magic link.',
    });

    const endpoint = `${API_URL}/auth/callback/email`;
    const token = getUrlParam('token_hash');
    const type = getUrlParam('type');
    const redirect = getUrlParam(PARAM_NAME.REDIRECT_AUTH);
    const next = encodeURIComponent(redirect || AUTH_URLS.REDIRECT.DEFAULT);
    const redirectUrl = `${endpoint}?token_hash=${token}&type=${type}&next=${next}`;
    window.location.href = redirectUrl;
  };

  return { status, handleTrigger };
};
