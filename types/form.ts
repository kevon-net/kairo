import { PostCreate } from "./models/post";
import { ProfileCreate } from "./models/profile";
import { TagCreate } from "./models/tag";
import { UserCreate } from "./models/user";

export interface Contact {
	fname: string;
	lname: string;
	email: string;
	phone: string | null;
	subject: string;
	message: string;
}

export interface SignUp {
	email: string;
	password: string;
}

export interface Verify {
	otp: string;
	email: string;
}

export interface SignIn {
	email: string;
	password: string;
	remember: boolean;
}

export type FormPostCreate = PostCreate & { userId: string; categoryId: string; tags: TagCreate[] };

export type FormUserCreate = UserCreate & { profile?: Omit<ProfileCreate, "user"> };
