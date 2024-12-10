'use client';

import { useState } from 'react';
import { signOut } from '@/handlers/events/auth';
import { showNotification } from '@/utilities/notifications';
import { Variant } from '@repo/enums';

export const useSignOut = (redirectUrl?: string, close?: () => void) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSignOut = async () => {
    try {
      setSubmitted(true);

      const response = await signOut();
      const result = await response.json();

      if (!result) throw new Error('No response from server');

      if (!result.error) {
        if (close) {
          close();
        }

        window.location.replace(redirectUrl || '/');
        return;
      }

      setSubmitted(false);

      if (response.status == 401) {
        showNotification({ variant: Variant.WARNING }, response, result);
        return null;
      }

      showNotification({ variant: Variant.FAILED }, response, result);
      return;
    } catch (error) {
      showNotification({
        variant: Variant.FAILED,
        desc: (error as Error).message,
      });
      return null;
    }
  };

  return { signOut: handleSignOut, loading: submitted };
};
