import prisma from "@/libraries/prisma";
import { emailSendPasswordForgot } from "@/libraries/wrappers/email/send/auth/password";
import { OtlType } from "@prisma/client";
import { generateToken } from "@/utilities/generators/token";
import { apiUrl } from "@/data/constants";
import { hashValue } from "@/utilities/helpers/hasher";
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

		// query database for otl
		const otlRecord = await prisma.otl.findUnique({
			where: { email_type: { email, type: OtlType.PASSWORD_RESET } }
		});

		const now = new Date();
		const expired = otlRecord?.expiresAt! < now;

		if (otlRecord && !expired) {
			// get time to expiration
			const expiry = otlRecord.expiresAt.getTime() - now.getTime();

			return NextResponse.json({ error: "Otp already sent", expiry }, { status: 409 });
		}

		// delete expired otl record if exists and is expired
		otlRecord &&
			expired &&
			(await prisma.otl.delete({ where: { email_type: { email, type: OtlType.PASSWORD_RESET } } }));

		// create token
		const token = await generateToken(
			{
				id: userRecord.id,
				email: userRecord.email,
				password: userRecord.password || process.env.AUTH_SECRET! // handle null password field (oauth)
			},
			5
		);

		// create otl value
		const otlValue = `${apiUrl}/auth/password/reset/${userRecord.id}/${token}`;

		// create otl hash
		const otlHash = await hashValue(otlValue);

		// create otl record
		await prisma.user.update({
			where: { email: userRecord.email },
			data: {
				otls: {
					create: [
						{
							id: generateId(),
							email: userRecord.email,
							type: OtlType.PASSWORD_RESET,
							otl: otlHash!,
							expiresAt: new Date(Date.now() + 60 * 60 * 1000) // in 1 hour
						}
					]
				}
			}
		});

		return NextResponse.json(
			{
				// email new link and show result in response body
				resend: await emailSendPasswordForgot({ email: userRecord.email, otl: otlValue }),
				message: "Otp sent"
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("---> route handler error (password forgot):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
