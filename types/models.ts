interface typeAt {
	createdAt: Date;
	updatedAt: Date;
}

export interface typeMessage extends typeAt {
	id?: number;
	fname: string;
	lname: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export interface typeUser extends typeAt {
	id: string;
	name?: string;
	email: string;
	password?: string;
	verified: boolean | number;
	role: string;
	posts: any[];
	coments: any[];
	replies: any[];
	otps: any[];
	otls: any[];
	profile: any;
	sessions: any;
	accounts: any;
}

export interface typeOtp extends typeAt {
	id?: number;
	otl: string;
	expires: string;
	user_id: number;
}
