export interface typeSessionUser {
	name: string;
	email: string;
	id: string;
	image: string;
}

export interface typeSession {
	accessToken: string;
	expires: string;
	user: typeSessionUser;
}
