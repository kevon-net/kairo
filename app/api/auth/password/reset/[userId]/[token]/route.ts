import prisma from "@/libraries/prisma";
import jwt from "jsonwebtoken";

import { typePasswordReset } from "@/types/apis";
import { emailSendPasswordChanged } from "@/libraries/wrappers/email/send/auth/password";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { OtlType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: typePasswordReset }) {
	try {
		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { id: params.userId } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// verify token
		try {
			const secret = process.env.NEXT_JWT_KEY! + (userRecord.password || process.env.AUTH_SECRET!);
			await jwt.verify(params.token, secret);
		} catch (error) {
			console.error(`---> helper function error (verify token):`, error);
			throw error;
		}

		const { password } = await request.json();

		const matches = await compareHashes(password, userRecord.password);

		if (matches) {
			return NextResponse.json({ error: "Password already used" }, { status: 409 });
		}

		// create hash
		const passwordHash = await hashValue(password);

		// update password field
		await prisma.user.update({ where: { id: params.userId }, data: { password: passwordHash } });

		// delete used otl record
		await prisma.otl.delete({ where: { email_type: { email: userRecord.email, type: OtlType.PASSWORD_RESET } } });

		return NextResponse.json(
			{
				// send otp email and output result in response body
				resend: await emailSendPasswordChanged({ email: userRecord.email }),
				message: "Password changed"
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("---> route handler error (password reset):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
