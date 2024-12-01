import { userDelete } from '@/handlers/requests/database/user';
import { DeleteAccountRequest } from '@/types/token';
import { decrypt } from '@/utilities/helpers/token';
import { getUrlParam } from '@/utilities/helpers/url';
import { useEffect, useState } from 'react';
import { signOut } from '@/handlers/events/auth';
import { useAppSelector } from '@/hooks/redux';

export const useFormUserAccountDeleteTrigger = () => {
  const [status, setStatus] = useState<{
    state: 'loading' | 'error' | 'success' | null;
    message?: string;
  }>({ state: null, message: 'Validating deletion request...' });
  const session = useAppSelector((state) => state.session.value);

  const handleTrigger = async () => {
    try {
      setStatus({ state: 'loading' });

      let parsed: DeleteAccountRequest;

      try {
        parsed = await decrypt(getUrlParam('token'));
      } catch {
        setStatus({
          state: 'error',
          message: 'Link is broken, expired or already used',
        });
        return;
      }

      const response = await userDelete({
        userId: parsed.userId,
        options: { trigger: true },
      });

      if (!response) throw new Error('No response from server');

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      if (session) {
        await signOut();
      }

      setStatus({ state: 'success', message: result.message });
      return;
    } catch (error) {
      setStatus({ state: 'error', message: (error as Error).message });
      return;
    }
  };

  useEffect(() => {
    handleTrigger();
  }, []);

  return { status };
};
