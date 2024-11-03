import prisma from "@/libraries/prisma";
import { emailSendPasswordForgot } from "@/libraries/wrappers/email/send/auth/password";
import { OtlType } from "@prisma/client";
import { generateToken } from "@/utilities/generators/token";
import { baseUrl } from "@/data/constants";
import { hashValue } from "@/utilities/helpers/hasher";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		if (!userRecord.verified) {
			return NextResponse.json({ error: "User not verified" }, { status: 403, statusText: "Not Veried" });
		}

		const otlRecord = await prisma.otl.findUnique({
			where: { userId_type: { userId: userRecord.id, type: OtlType.PASSWORD_RESET } },
		});

		const now = new Date();
		const expired = otlRecord?.expiresAt! < now;

		if (otlRecord && !expired) {
			const expiry = otlRecord.expiresAt.getTime() - now.getTime();

			return NextResponse.json(
				{ error: "OTL already sent", expiry },
				{ status: 409, statusText: "Already Sent" }
			);
		}

		otlRecord &&
			expired &&
			(await prisma.otl.delete({
				where: { userId_type: { userId: userRecord.id, type: OtlType.PASSWORD_RESET } },
			}));

		const token = await generateToken(
			{
				id: userRecord.id,
				email: userRecord.email,
				password: userRecord.password || process.env.AUTH_SECRET!,
			},
			5
		);

		const otlValue = `${baseUrl}/auth/password/reset/${userRecord.id}/${token}`;

		const otlHash = await hashValue(otlValue);

		await prisma.user.update({
			where: { email: userRecord.email },
			data: {
				otls: {
					create: [
						{
							id: generateId(),
							type: OtlType.PASSWORD_RESET,
							otl: otlHash!,
							expiresAt: new Date(Date.now() + 60 * 60 * 1000),
						},
					],
				},
			},
		});

		return NextResponse.json(
			{
				message: "An OTL has been sent",
				resend: await emailSendPasswordForgot({ email: userRecord.email, otl: otlValue }),
			},
			{ status: 200, statusText: "OTL Sent" }
		);
	} catch (error) {
		console.error("---> route handler error (password forgot):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
