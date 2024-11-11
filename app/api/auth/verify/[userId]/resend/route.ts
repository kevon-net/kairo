import { emailSendSignUp } from "@/libraries/wrappers/email/send/auth/sign-up";
import { generateOtpCode } from "@/utilities/generators/otp";
import prisma from "@/libraries/prisma";
import { hashValue } from "@/utilities/helpers/hasher";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";
import { SubType, Type } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { id: params.userId } });

		if (!userRecord) {
			return NextResponse.json({ error: "The link is broken" }, { status: 404, statusText: "Invalid Link" });
		}

		if (userRecord.verified) {
			return NextResponse.json(
				{ error: "Account is already verified" },
				{ status: 409, statusText: "Already Verified" }
			);
		}

		// query database for otp
		const otpRecord = await prisma.token.findUnique({
			where: { type_subType_userId: { type: Type.OTP, subType: SubType.CONFIRM_EMAIL, userId: params.userId } },
		});

		// create otp
		const otpValue = generateOtpCode();

		// create otp hash
		const otpHash = await hashValue(otpValue);

		const now = new Date();
		const expired = otpRecord && otpRecord.expiresAt < now;

		if (!otpRecord || expired) {
			// delete otp record if expired
			expired &&
				(await prisma.token.delete({
					where: {
						type_subType_userId: { type: Type.OTP, subType: SubType.CONFIRM_EMAIL, userId: params.userId },
					},
				}));

			// create new otp record
			await prisma.user.update({
				where: { id: params.userId },
				data: {
					tokens: {
						create: [
							{
								id: generateId(),
								type: Type.OTP,
								subType: SubType.CONFIRM_EMAIL,
								token: otpHash!,
								expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
							},
						],
					},
				},
			});

			return NextResponse.json(
				{
					message: "A new OTP has been sent",
					// send otp email
					resend: await emailSendSignUp(otpValue.toString(), userRecord.email),
				},
				{ status: 200, statusText: "OTP Sent" }
			);
		}

		const expiry = otpRecord && otpRecord.expiresAt.getTime() - now.getTime();
		return NextResponse.json(
			{ error: "OTP already sent", otp: { expiry } },
			{ status: 409, statusText: "Already Sent" }
		);
	} catch (error) {
		console.error("---> route handler error (verify resend):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
