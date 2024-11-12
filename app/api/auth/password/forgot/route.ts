import { baseUrl } from "@/data/constants";
import prisma from "@/libraries/prisma";

import { emailCreatePasswordForgot } from "@/libraries/wrappers/email/send/auth/password";
import { generateId } from "@/utilities/generators/id";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { encrypt } from "@/utilities/helpers/token";
import { SubType, Type } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const email: string = await request.json();

		const userRecord = await prisma.user.findUnique({
			where: { email },
			include: { tokens: { where: { type: Type.JWT, subType: SubType.PASSWORD_RESET } } },
		});

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		const now = new Date();
		const expired = userRecord.tokens[0]?.expiresAt! < now;

		if (userRecord.tokens[0] && !expired) {
			const expiry = userRecord.tokens[0].expiresAt.getTime() - now.getTime();

			return NextResponse.json(
				{ error: "OTL already sent", expiry },
				{ status: 409, statusText: "Already Sent" }
			);
		}

		const expiry = new Date(Date.now() + 5 * 60 * 1000);

		const id = generateId();

		const token = await encrypt({ id, userId: userRecord.id }, 5 * 60);

		const tokens = await prisma.$transaction(async () => {
			const deleteExpired = await prisma.token.deleteMany({
				where: {
					type: Type.JWT,
					subType: SubType.PASSWORD_RESET,
					userId: userRecord.id,
					expiresAt: { lt: now },
				},
			});

			const createNew = await prisma.token.create({
				data: {
					id,
					type: Type.JWT,
					subType: SubType.PASSWORD_RESET,
					token: token,
					expiresAt: expiry,
					userId: userRecord.id,
				},
			});

			return { deleteExpired, createNew };
		});

		const otlValue = `${baseUrl}/auth/password/reset?token=${token}`;

		console.log("otlValue", otlValue);

		return NextResponse.json(
			{
				message: "An OTL has been sent",
				token: tokens.createNew,
				// resend: await emailCreatePasswordForgot(otlValue, userRecord.email),
			},
			{ status: 200, statusText: "OTL Sent" }
		);
	} catch (error) {
		console.error("---> route handler error (password reset):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
