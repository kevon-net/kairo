import prisma from "@/libraries/prisma";
import { segmentFullName } from "@/utilities/formatters/string";
import { generateId } from "@/utilities/generators/id";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { UserCreate, UserGet, UserUpdate } from "@/types/models/user";

export async function POST(request: NextRequest) {
	try {
		const user: UserCreate = await request.json();

		const userRecord = await prisma.user.findUnique({ where: { email: user.email } });

		if (userRecord) {
			return NextResponse.json({ error: "User already exists" }, { status: 409, statusText: "Already Exists" });
		}

		await prisma.user.create({
			data: {
				id: generateId(),
				name: user.name || null,
				email: user.email,
				profile: !user.name
					? undefined
					: {
							create: {
								id: generateId(),
								firstName: segmentFullName(user.name).first,
								lastName: segmentFullName(user.name).last,
							},
					  },
			},
		});

		return NextResponse.json({ error: "User created successfully" }, { status: 200, statusText: "User Created" });
	} catch (error) {
		console.error("---> route handler error (create user):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const { user, options }: { user: UserUpdate; options: { name: boolean; password: boolean } } =
			await request.json();

		const userRecord = await prisma.user.findUnique({ where: { email: user.email as string } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		if (options.name) {
			await prisma.user.update({
				where: { id: session.user.id },
				data: {
					...user,
					profile: {
						update: {
							firstName: segmentFullName(user.name as string).first,
							lastName: segmentFullName(user.name as string).last,
						},
					},
				},
			});

			return NextResponse.json(
				{ message: "User record has been updated" },
				{ status: 200, statusText: "User Updated" }
			);
		}

		if (options.password) {
			const passwordMatch =
				(!user.password && !userRecord.password) ||
				(await compareHashes(user.password as string, userRecord.password));

			if (!passwordMatch) {
				return NextResponse.json(
					{ error: "You've entered the wrong password" },
					{ status: 403, statusText: "Wrong Password" }
				);
			}

			const passwordHash = await hashValue(user.password as string);

			await prisma.user.update({ where: { id: session.user.id }, data: { password: passwordHash } });

			return NextResponse.json(
				{ message: "Password changed successfully" },
				{ status: 200, statusText: "Password Changed" }
			);
		}
	} catch (error) {
		console.error("---> route handler error (update user):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
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
