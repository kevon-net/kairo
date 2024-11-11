import { contactCreate } from "@/libraries/wrappers/email/contact";
import { generateOtpCode } from "@/utilities/generators/otp";
import prisma from "@/libraries/prisma";
import { hashValue } from "@/utilities/helpers/hasher";
import { emailSendSignUp } from "@/libraries/wrappers/email/send/auth/sign-up";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";
import { SubType, Type } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (userRecord) {
			return NextResponse.json(
				{ error: "Already signed up", user: { id: userRecord.id, verified: userRecord.verified } },
				{ status: 409, statusText: "User Exists" }
			);
		}

		// create otp
		const otpValue = generateOtpCode();

		// create otp hash
		const otpHash = await hashValue(otpValue);

		// create user id
		const userId = generateId();

		// create user record
		await prisma.user.create({
			data: {
				id: userId,
				email,
				password: (await hashValue(password.initial)) || null,

				// create user profile record
				profile: { create: { id: generateId(), name } },

				// create user otp record
				tokens: !otpHash
					? undefined
					: {
							create: [
								{
									id: generateId(),
									type: Type.OTP,
									subType: SubType.CONFIRM_EMAIL,
									token: otpHash,
									expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
								},
							],
					  },
			},
		});

		console.log(otpValue);

		return NextResponse.json(
			{
				user: { id: userId, email },
				message: "Your account has been created",
				// // send otp email and output result in response body
				// resend: {
				// 	// send otp email
				// 	email: await emailSendSignUp(otpValue.toString(), email),
				// 	// add to audience
				// 	contact: await contactCreate({ name: `${name.first} ${name.last}`, email }),
				// },
			},
			{ status: 200, statusText: `Welcome, ${name.first}` }
		);
	} catch (error) {
		console.error("---> route handler error (sign up):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
