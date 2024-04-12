import { Model } from "sequelize";

interface typeMessage {
	id?: number;
	fname: string;
	lname: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}
export interface typeMessageInstance extends Model<typeMessage>, typeMessage {}

interface typeUser {
	id?: number;
	fname: string;
	lname: string;
	email: string;
	phone: string;
	password: string;
	verified: boolean | number;
}
export interface typeUserInstance extends Model<typeUser>, typeUser {}

interface typeOtl {
	id?: number;
	email: string;
	otl: string;
	userId: number;
	createdAt: number;
	expiredAt: number;
}
export interface typeOtlInstance extends Model<typeOtl>, typeOtl {}

interface typeOtp {
	id?: number;
	email: string;
	otp: string;
	createdAt: number;
	expiredAt: number;
}
export interface typeOtpInstance extends Model<typeOtp>, typeOtp {}
