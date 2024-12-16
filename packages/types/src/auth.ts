import { Role, Status } from '@repo/schemas/node_modules/@prisma/client';

export interface UserInfo {
  accessToken: string;
  accountId: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface Credentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface Session {
  id: string;
  ip: string;
  os: string | null;
  city: string | null;
  country: string | null;
  loc: string | null;
  status: Status;
  user: {
    id: string;
    email: string;
    verified: boolean;
    role: Role;
    status: Status;
    name: string;
    image: string | null;
    remember: boolean;
    withPassword: boolean;
  };

  expires: Date;
  iat: number;
  exp: Date;
}
