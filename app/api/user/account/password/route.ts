import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
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

		const { passwordCurrent, passwordNew } = await request.json();

		const passwordMatch = await compareHashes(passwordCurrent, userRecord.password);

		if (!passwordMatch) {
			return NextResponse.json({ error: "Password doesn't match" }, { status: 403 });
		} else {
			const passwordHash = await hashValue(passwordNew);

			await prisma.user.update({ where: { id: session.user.id }, data: { password: passwordHash } });

			return NextResponse.json({ message: "Password changed" }, { status: 200 });
		}
	} catch (error) {
		console.error("---> route handler error (change password):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
