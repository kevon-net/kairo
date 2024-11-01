import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { compareHashes, hashValue } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: "You must be signed in" }, { status: 401, statusText: "Unauthorized" });
		}

		const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		const { password } = await request.json();

		const passwordMatch = !userRecord.password
			? !password.current
			: await compareHashes(password.current, userRecord.password);

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "You've entered the wrong password" },
				{ status: 403, statusText: "Wrong Password" }
			);
		}

		const passwordHash = await hashValue(password.new);

		// update password in database
		await prisma.user.update({ where: { id: session.user.id }, data: { password: passwordHash } });

		return NextResponse.json(
			{ message: "Password changed successfully" },
			{ status: 200, statusText: "Password Changed" }
		);
	} catch (error) {
		console.error("---> route handler error (change password):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
