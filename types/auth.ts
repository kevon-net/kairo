import { Role, Status } from "@prisma/client";

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
	};
	expires: Date;
	iat: number;
	exp: Date;
}
