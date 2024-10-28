import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const { password } = await request.json();

		const passwordMatch =
			(!password.trim() && !userRecord.password) || (await compareHashes(password, userRecord.password));

		if (!passwordMatch) {
			return NextResponse.json({ error: "Password doesn't match" }, { status: 403 });
		} else {
			// delete user and related records
			await prisma.user.delete({
				where: { id: session.user.id },
				include: {
					profile: true,
					accounts: true,
					sessions: true,
					authenticator: true,
					otps: true,
					otls: true,
					posts: true
				}
			});

			return NextResponse.json({ message: "Account deleted" }, { status: 200 });
		}
	} catch (error) {
		console.error("---> route handler error (delete account):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
