import { emailSendSignUp } from "@/libraries/wrappers/email/send/auth/sign-up";
import { generateOtpCode } from "@/utilities/generators/otp";
import prisma from "@/libraries/prisma";
import { hashValue } from "@/utilities/helpers/hasher";
import { OtpType } from "@prisma/client";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (userRecord.verified) {
			return NextResponse.json({ error: "User already verified" }, { status: 409 });
		}

		// query database for otp
		const otpRecord = await prisma.otp.findUnique({
			where: { email_type: { email, type: OtpType.EMAIL_CONFIRMATION } }
		});

		// create otp
		const otpValue = generateOtpCode();

		// create otp hash
		const otpHash = await hashValue(String(otpValue));

		const now = new Date();
		const expired = otpRecord && otpRecord.expiresAt < now;

		if (!otpRecord || expired) {
			// delete otp record if expired
			expired &&
				(await prisma.otp.delete({ where: { email_type: { email, type: OtpType.EMAIL_CONFIRMATION } } }));

			// create new otp record
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
					// send otp email
					resend: await emailSendSignUp({ otp: otpValue.toString(), email }),
					message: "Otp sent"
				},
				{ status: 200 }
			);
		}

		const expiry = otpRecord && otpRecord.expiresAt.getTime() - now.getTime();
		return NextResponse.json({ error: "Otp already sent", expiry }, { status: 409 });
	} catch (error) {
		console.error("---> route handler error (verify resend):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
