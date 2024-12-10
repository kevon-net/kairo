import { Session as SessionPayload } from '@repo/types';

export type Session = Omit<SessionPayload, 'iat' | 'exp'> | null;
