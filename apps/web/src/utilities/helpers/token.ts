'use server';

import { key } from '@/data/constants';
import { Jwt } from '@/enums/algorithm';
import { SignJWT, jwtVerify } from 'jose';

export const encrypt = async (payload: any, expiryInSec?: number) =>
  await new SignJWT(payload)
    .setProtectedHeader({ alg: Jwt.HS256 })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + (expiryInSec || 60 * 60) * 1000))
    .sign(key);

export const decrypt = async (token: string): Promise<any> => {
  const { payload } = await jwtVerify(token, key, {
    algorithms: [Jwt.HS256],
  });
  return payload;
};
