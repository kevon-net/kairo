import prisma from "@/libraries/prisma";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { UserCreate, UserUpdate } from "@/types/models/user";
import { getSession } from "@/utilities/helpers/session";
import { SubType, Type } from "@prisma/client";

export async function POST(request: NextRequest) {
	try {
		const user: UserCreate = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { email: user.email } });

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

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 404, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({
			where: { id: params.userId },
			include: { tokens: { where: { type: Type.JWT, subType: SubType.PASSWORD_RESET } } },
		});

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		if (!userRecord.verified) {
			return NextResponse.json({ error: "User not verified" }, { status: 403, statusText: "Not Veried" });
		}

		const { user, options }: { user: UserUpdate; options?: { password?: string } } = await request.json();

		if (options?.password) {
			const passwordMatch =
				(!options.password && !userRecord.password) ||
				(await compareHashes(options.password, userRecord.password));

			if (!passwordMatch) {
				return NextResponse.json(
					{ error: "You've entered the wrong password" },
					{ status: 403, statusText: "Wrong Password" }
				);
			}

			const passwordSame = await compareHashes(options.password, userRecord.password);

			if (passwordSame) {
				return NextResponse.json(
					{ error: "Password already used" },
					{ status: 409, statusText: "Password Used" }
				);
			}

			// // verify token
			// try {
			// 	const secret = process.env.NEXT_JWT_KEY! + (userRecord.password || process.env.AUTH_SECRET!);
			// 	await jwt.verify(params.token, secret);
			// } catch (error) {
			// 	return NextResponse.json(
			// 		{ error: "Link is broken, expired or already used" },
			// 		{ status: 403, statusText: "Invalid Link" }
			// 	);
			// }

			// // update session on server
			// session.withPassword = true;

			await prisma.user.update({
				where: { id: params.userId },
				data: { password: await hashValue(user.password as string) },
			});

			// delete used otl record if exists
			if (userRecord.tokens.length > 0) {
				await prisma.token.delete({
					where: {
						type_subType_userId: { type: Type.JWT, subType: SubType.PASSWORD_RESET, userId: params.userId },
					},
				});
			}

			return NextResponse.json(
				{ message: "Password changed successfully" },
				{ status: 200, statusText: "Password Changed" }
			);
		}

		await prisma.user.update({ where: { id: params.userId }, data: user });

		return NextResponse.json(
			{ message: "User record has been updated" },
			{ status: 200, statusText: "User Updated" }
		);
	} catch (error) {
		console.error("---> route handler error (update user):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ error: "Sign in to continue" }, { status: 404, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: params.userId } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		const { password }: { password: string | null } = await request.json();

		const passwordMatch =
			(!password && !userRecord.password) || (await compareHashes(password!, userRecord.password));

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "You've entered the wrong password" },
				{ status: 403, statusText: "Wrong Password" }
			);
		}

		await prisma.user.delete({ where: { id: params.userId } });

		return NextResponse.json(
			{ message: "Your account has been deleted" },
			{ status: 200, statusText: "Account Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete user):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
