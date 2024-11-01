import { auth } from "@/auth";
import prisma from "@/libraries/prisma";
import { compareHashes } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

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

		const { password } = await request.json();

		const passwordMatch =
			(!password.trim() && !userRecord.password) || (await compareHashes(password, userRecord.password));

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "You've entered the wrong password" },
				{ status: 403, statusText: "Wrong Password" }
			);
		}

		// delete user from database (prisma config is set to cascade delete)
		await prisma.user.delete({ where: { id: session.user.id } });

		return NextResponse.json(
			{ message: "Your account has been deleted" },
			{ status: 200, statusText: "Account Deleted" }
		);
	} catch (error) {
		console.error("---> route handler error (delete account):", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
