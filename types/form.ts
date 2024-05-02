export interface typeContact {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export interface typeSignUp {
	name: string;
	email: string;
	password: string;
}

export interface typeSignIn {
	email: string;
	password: string;
}

export interface typeVerify {
	email?: string;
	otp: string;
}

export interface typeForgot {
	email: string;
}

export interface typeReset {
	password: string;
	id?: string;
	token?: string;
}

export interface typeRemaining {
	minutes: number;
	seconds: string;
}
