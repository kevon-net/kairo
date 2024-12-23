import { useState } from 'react';
import { verifyEmail } from '@/handlers/requests/auth/verify';
import { getUrlParam } from '@repo/utils/helpers';

export const useFormAuthVerifyEmail = () => {
  const [status, setStatus] = useState<{
    status: 'loading' | 'success' | 'error' | null;
    message?: string;
  } | null>(null);

  const handleSubmit = async () => {
    try {
      setStatus({ status: 'loading' });

      const response = await await verifyEmail({
        tokenHash: getUrlParam('token_hash'),
        type: getUrlParam('type'),
        next: getUrlParam('next'),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setStatus({
        status: 'success',
        message: 'Your email has been verified.',
      });
    } catch (error) {
      setStatus({ status: 'error', message: (error as Error).message });
    }
  };

  return { handleSubmit, status };
};
