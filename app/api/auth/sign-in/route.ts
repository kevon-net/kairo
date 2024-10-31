import prisma from "@/libraries/prisma";
import { Credentials } from "@/types/auth";
import { compareHashes } from "@/utilities/helpers/hasher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const credentials: Credentials = await request.json();

		// check if user exists
		const userRecord = await prisma.user.findUnique({ where: { email: credentials.email as string } });

		if (!userRecord) {
			return NextResponse.json({ error: "User not found" }, { status: 404, statusText: "Not Found" });
		}

		// check if provided password is correct
		const passwordMatch = await compareHashes(credentials.password as string, userRecord.password!);

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "Invalid username/password" },
				{ status: 401, statusText: "Unauthorized" }
			);
		}

		if (!userRecord.verified) {
			return NextResponse.json(
				{ error: "User not verified", user: userRecord },
				{ status: 403, statusText: "Not Verified" }
			);
		}

		return NextResponse.json({ user: userRecord }, { status: 200 });
	} catch (error) {
		console.error("---> route handler error (sign in):", error);
		return NextResponse.json({ error: "Something went wrong on our end" }, { status: 500 });
	}
}
