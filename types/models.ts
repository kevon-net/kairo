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
	id: number;
	email: string;
	password: string;
	verified: boolean | number;
	role: string;
	// posts: typePost[];
	// coments: typeComment[];
	// replies: typeReply[];
	// otps: typeOtp[];
	// profile: typeProfile;
	// session: typeSession;
}

export interface typeOtp extends typeAt {
	id?: number;
	otl: string;
	expires: string;
	user_id: number;
}
