import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { OtpType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { otp, email } = await request.json();

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

		const now = new Date();
		const expired = otpRecord && otpRecord.expiresAt < now;

		if (!otpRecord || expired) {
			// delete otp record if expired
			expired &&
				(await prisma.otp.delete({
					where: { email_type: { email, type: OtpType.EMAIL_CONFIRMATION } }
				}));

			return NextResponse.json({ error: "Otp expired or doesn't exist" }, { status: 409 });
		}

		const match = otpRecord && (await compareHashes(otp, otpRecord?.otp));

		if (!match) {
			return NextResponse.json({ error: "Otp doesn't match" }, { status: 403 });
		}

		// update user field to verified
		await prisma.user.update({ where: { email }, data: { verified: true } });

		// delete used otp record
		await prisma.otp.delete({ where: { email_type: { email, type: OtpType.EMAIL_CONFIRMATION } } });

		return NextResponse.json({ message: "Email verified" }, { status: 200 });
	} catch (error) {
		console.error("---> route handler error (verify):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
