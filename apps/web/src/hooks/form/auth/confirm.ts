'use client';

import { API_URL, URL_PARAM } from '@/data/constants';
import { getUrlParam } from '@repo/utils/helpers';
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

    const endpoint = `${API_URL}/auth/confirm/email`;
    const token = getUrlParam('token_hash');
    const type = getUrlParam('type');
    const next = encodeURIComponent(getUrlParam(URL_PARAM.REDIRECT));
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
      message: 'Please wait while we verifiy the magic link.',
    });

    const endpoint = `${API_URL}/auth/confirm/email`;
    const token = getUrlParam('token_hash');
    const type = getUrlParam('type');
    const next = encodeURIComponent(getUrlParam(URL_PARAM.REDIRECT));
    window.location.href = `${endpoint}?token_hash=${token}&type=${type}&next=${next}`;
  };

  return { status, handleTrigger };
};
