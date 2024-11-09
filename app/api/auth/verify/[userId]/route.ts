import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { OtpType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const otp = await request.json();

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
		const otpRecord = await prisma.otp.findUnique({
			where: { userId_type: { userId: params.userId, type: OtpType.EMAIL_CONFIRMATION } },
		});

		const match = otpRecord && (await compareHashes(otp, otpRecord?.otp));

		if (!match) {
			return NextResponse.json({ error: "OTP doesn't match" }, { status: 401, statusText: "Invalid OTP" });
		}

		const now = new Date();
		const expired = otpRecord && otpRecord.expiresAt < now;

		if (!otpRecord || expired) {
			// delete otp record if expired
			expired &&
				(await prisma.otp.delete({
					where: { userId_type: { userId: params.userId, type: OtpType.EMAIL_CONFIRMATION } },
				}));

			return NextResponse.json(
				{ error: "OTP expired or doesn't exist. Request a new OTP" },
				{ status: 409, statusText: "Invalid OTP" }
			);
		}

		// update user field to verified
		await prisma.user.update({ where: { id: params.userId }, data: { verified: true } });

		// delete used otp record
		await prisma.otp.delete({
			where: { userId_type: { userId: params.userId, type: OtpType.EMAIL_CONFIRMATION } },
		});

		return NextResponse.json({ message: "You can now sign in" }, { status: 200, statusText: "Account Verified" });
	} catch (error) {
		console.error("---> route handler error (verify):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
