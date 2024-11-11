import prisma from "@/libraries/prisma";

import { emailCreatePasswordChanged } from "@/libraries/wrappers/email/send/auth/password";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
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

		userRecord.tokens[0] &&
			expired &&
			(await prisma.token.delete({
				where: {
					type_subType_userId: { type: Type.JWT, subType: SubType.PASSWORD_RESET, userId: userRecord.id },
				},
			}));

		// const token = await generateToken(
		// 	{
		// 		id: userRecord.id,
		// 		email: userRecord.email,
		// 		password: userRecord.password || process.env.AUTH_SECRET!,
		// 	},
		// 	5
		// );

		// const otlValue = `${baseUrl}/auth/password/reset/${userRecord.id}/${token}`;

		// const otlHash = await hashValue(otlValue);

		// await prisma.user.update({
		// 	where: { email: userRecord.email },
		// 	data: {
		// 		otls: {
		// 			create: [
		// 				{
		// 					id: generateId(),
		// 					type: OtlType.PASSWORD_RESET,
		// 					otl: otlHash!,
		// 					expiresAt: new Date(Date.now() + 60 * 60 * 1000),
		// 				},
		// 			],
		// 		},
		// 	},
		// });

		return NextResponse.json(
			{
				message: "An OTL has been sent",
				// resend: await emailCreatePasswordForgot(otlValue, userRecord.email),
			},
			{ status: 200, statusText: "OTL Sent" }
		);
	} catch (error) {
		console.error("---> route handler error (password reset):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
