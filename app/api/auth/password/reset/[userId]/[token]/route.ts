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
			return NextResponse.json({ error: "The link is broken" }, { status: 404, statusText: "Invalid Link" });
		}

		// verify token
		try {
			const secret = process.env.NEXT_JWT_KEY! + (userRecord.password || process.env.AUTH_SECRET!);
			await jwt.verify(params.token, secret);
		} catch (error) {
			return NextResponse.json(
				{ error: "Link is broken, expired or already used" },
				{ status: 403, statusText: "Invalid Link" }
			);
		}

		const { password } = await request.json();

		const matches = await compareHashes(password, userRecord.password);

		if (matches) {
			return NextResponse.json({ error: "Password already used" }, { status: 409, statusText: "Password Used" });
		}

		// create hash
		const passwordHash = await hashValue(password);

		// update password field
		await prisma.user.update({ where: { id: params.userId }, data: { password: passwordHash } });

		// delete used otl record
		await prisma.otl.delete({ where: { userId_type: { userId: userRecord.id, type: OtlType.PASSWORD_RESET } } });

		return NextResponse.json(
			{
				message: "Password updated successfully",
				// send otp email and output result in response body
				resend: await emailSendPasswordChanged({ email: userRecord.email }),
			},
			{ status: 200, statusText: "Password Changed" }
		);
	} catch (error) {
		console.error("---> route handler error (password reset):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
