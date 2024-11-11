import prisma from "@/libraries/prisma";
import { segmentFullName } from "@/utilities/formatters/string";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { UserCreate, UserGet, UserUpdate } from "@/types/models/user";
import { baseUrl } from "@/data/constants";
import { emailCreatePasswordForgot } from "@/libraries/wrappers/email/send/auth/password";
import { getSession } from "@/utilities/helpers/session";
import { SubType, Type } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		const user: UserCreate = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { email: user.email }, include: { profile: true } });

		if (userRecord) {
			return NextResponse.json(
				{ error: "User already exists", user: userRecord },
				{ status: 409, statusText: "Already Exists" }
			);
		}

		const createUser = await prisma.user.create({ data: { id: generateId(), ...user } });

		return NextResponse.json(
			{ error: "User created successfully", user: createUser },
			{ status: 200, statusText: "User Created" }
		);
	} catch (error) {
		console.error("---> route handler error (create user):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const {
			user,
			options,
		}: {
			user: UserUpdate;
			options: { password?: { update?: { newPassword: string }; forgot?: "update" } };
		} = await request.json();

		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 404, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		if (!userRecord.verified) {
			return NextResponse.json({ error: "User not verified" }, { status: 403, statusText: "Not Veried" });
		}

		if (options.password?.update) {
			const passwordMatch =
				(!user.password && !userRecord.password) ||
				(await compareHashes(user.password as string, userRecord.password));

			if (!passwordMatch) {
				return NextResponse.json(
					{ error: "You've entered the wrong password" },
					{ status: 403, statusText: "Wrong Password" }
				);
			}

			// // get signin method boolean
			// session.withPassword = true;

			const passwordHash = await hashValue(options.password.update.newPassword);

			await prisma.user.update({ where: { id: session.user.id }, data: { password: passwordHash } });

			return NextResponse.json(
				{ message: "Password changed successfully" },
				{ status: 200, statusText: "Password Changed" }
			);
		}

		if (options.password?.forgot) {
			const otlRecord = await prisma.token.findUnique({
				where: {
					type_subType_userId: { type: Type.JWT, subType: SubType.PASSWORD_RESET, userId: userRecord.id },
				},
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
		}

		await prisma.user.update({ where: { id: session.user.id }, data: user });

		return NextResponse.json(
			{ message: "User record has been updated" },
			{ status: 200, statusText: "User Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update user):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 404, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json(
				{ error: "User and account data already deleted" },
				{ status: 404, statusText: "Already Deleted" }
			);
		}

		const user: UserGet = await request.json();

		const passwordMatch =
			(!user.password && !userRecord.password) || (await compareHashes(user.password!, userRecord.password));

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "You've entered the wrong password" },
				{ status: 403, statusText: "Wrong Password" }
			);
		}

		await prisma.user.delete({ where: { id: session.user.id } });

		return NextResponse.json(
			{ message: "Your account has been deleted" },
			{ status: 200, statusText: "Account Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete user):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
