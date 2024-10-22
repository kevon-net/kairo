import { PostCreate } from "./models/post";
import { ProfileCreate } from "./models/profile";
import { TagCreate } from "./models/tag";
import { UserCreate } from "./models/user";

export interface PasswordForgot {
	email: string;
}

export interface PasswordReset {
	password: string;
	passwordConfirm: string;
}

export interface SignUp extends PasswordReset {
	email: string;
}

export interface SignIn {
	email: string;
	password: string;
	remember: false;
}

export interface Profile {
	name: string;
	email: string;
	phone: string;
}

export interface AccountDelete {
	password: string;
}

export interface AccountPassword {
	passwordCurrent: string;
	passwordNew: string;
}

export interface Contact {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export interface Verify {
	otp: string;
	email: string;
}

export type FormPostCreate = PostCreate & {
	userId: string;
	categoryId: string;
	tags: TagCreate[];
};

export type FormUserCreate = UserCreate & {
	profile?: Omit<ProfileCreate, "user">;
};
