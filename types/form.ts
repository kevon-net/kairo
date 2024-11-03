import { PostCreate } from "./models/post";
import { ProfileCreate } from "./models/profile";
import { TagCreate } from "./models/tag";
import { UserCreate } from "./models/user";

export interface PasswordForgot {
	email: string;
}

export interface PasswordReset {
	password: { initial: string; confirm: string };
}

export interface SignUp extends PasswordReset {
	name: { first: string; last: string };
	email: string;
}

export interface SignIn {
	email: string;
	password: string;
	remember: false;
}

export interface Profile {
	name: { first: string; last: string };
	email: string;
	phone: string;
}

export interface AccountDelete {
	password: string;
}

export interface AccountPassword {
	password: { current: string; new: string };
}

export interface Verify {
	otp: string;
	userId: string;
}

export type FormPostCreate = PostCreate & {
	userId: string;
	categoryId: string;
	tags: TagCreate[];
};

export type FormUserCreate = UserCreate & {
	profile?: Omit<ProfileCreate, "user">;
};
