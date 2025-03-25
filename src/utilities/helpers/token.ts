'use server';

import { Jwt } from '@/enums/algorithm';
import { SignJWT, jwtVerify } from 'jose';

export const encrypt = async (
  payload: any,
  key: Uint8Array,
  expiryInSec?: number
) =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: Jwt.HS256 })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + (expiryInSec || 60 * 60) * 1000))
    .sign(key);

export const decrypt = async (token: string, key: Uint8Array): Promise<any> => {
  const { payload } = await jwtVerify(token, key, {
    algorithms: [Jwt.HS256],
  });
  return payload;
};
