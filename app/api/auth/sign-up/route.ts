import { emailContactCreate } from "@/libraries/wrappers/email/contact";
import { generateOtpCode } from "@/utilities/generators/otp";
import prisma from "@/libraries/prisma";
import { hashValue } from "@/utilities/helpers/hasher";
import { emailSendSignUp } from "@/libraries/wrappers/email/send/auth/sign-up";
import { generateId } from "@/utilities/generators/id";
import { OtpType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (userRecord) {
			return NextResponse.json({ error: "User already exists", verified: userRecord.verified }, { status: 409 });
		}

		// create user record
		await prisma.user.create({ data: { id: generateId(), email, password: (await hashValue(password)) || null } });

		// create otp
		const otpValue = generateOtpCode();

		// create otp hash
		const otpHash = await hashValue(String(otpValue));

		// create otp record
		await prisma.user.update({
			where: { email },
			data: {
				otps: {
					create: [
						{
							id: generateId(),
							type: OtpType.EMAIL_CONFIRMATION,
							email: email,
							otp: otpHash!,
							expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
						}
					]
				}
			}
		});

		return NextResponse.json(
			{
				// send otp email and output result in response body
				resend: {
					// send otp email
					email: await emailSendSignUp({ otp: otpValue.toString(), email }),
					// add to audience
					contact: await emailContactCreate({ email })
				},
				message: "Otp sent"
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("---> route handler error (sign up):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
