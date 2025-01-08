'use client';

import { API_URL, URL_PARAM } from '@/data/constants';
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
    const redirect = getUrlParam(URL_PARAM.REDIRECT);
    const next = encodeURIComponent(redirect);
    window.location.href = `${endpoint}?token_hash=${token}&type=${type}&next=${next}`;
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
    const redirect = getUrlParam(URL_PARAM.REDIRECT);
    const next = encodeURIComponent(redirect);
    window.location.href = `${endpoint}?token_hash=${token}&type=${type}&next=${next}`;
  };

  return { status, handleTrigger };
};
